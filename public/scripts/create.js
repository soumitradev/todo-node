var title_text_input = document.getElementById('landing-todo');
var add_task_button = document.getElementById('add-task-button');
var last_active_input = document.getElementById('last-active-input');
// Get some elements that we will change

// Global vars
var id = undefined;
var num_tasks = 1;

// Set the text prefix for custom link
document.getElementById('custom-link-prefix').innerHTML = window.location.href + "todo/";

// Prefill the title as date, and create a todo on load
async function prefill_title_date() {
    let today = new Date();
    let mnthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let year = today.getFullYear();
    let mnth = mnthNames[today.getMonth()];
    let dat = today.getDate();
    if (!document.getElementById('todo-title-input').value) {
        document.getElementById('todo-title-input').value = mnth + " " + dat + ", " + year;
    }
    await createTodo();
}

// Generate the data required for making a PUT or POST request
// If updating and not creating, the updating var is true. This decides if the id is specified in the request
// If moving the todo to a new location, newID is location to save it at
async function generatePayload(updating, newID) {
    let listItems = document.querySelector(".task-list").children;
    let tasks = [];
    for (let i = 0; i < listItems.length; i++) {
        const taskDivChildren = listItems[i].children;
        let task = {
            body: taskDivChildren[1].value,
            done: taskDivChildren[0].checked
        }
        tasks.push(task);
    }
    title = document.getElementById("todo-title-input").value;
    desc = document.getElementById("todo-desc-input").value;
    let priv = document.getElementById("private-checkbox").checked;

    payload = {
        title: title,
        desc: desc,
        tasks: tasks,
        private: priv,
    }

    if (updating && id) {
        payload.id = id;
    }

    if (updating && newID) {
        payload.nid = newID;
    }
    console.log(payload);

    return payload;
}

// Create Todo
async function createTodo() {
    let res = await fetch('/api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify(await generatePayload(false, false)),
    });
    js = await res.json();
    id = js._id;
    document.getElementById("todo-link").value = `${window.location.href}todo/${id}`;
}

// Delete todo and redirect to home
async function deleteTodo() {
    let res = await fetch('/api/v1/todo/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'DELETE',
    });
    location.href = '/';
}

// Update todo
async function updateTodo() {
    let newID = document.getElementById('custom-link').value;
    let res = await fetch('/api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(await generatePayload(true, newID ? newID : false)),
    });

    if (res.status === 400) {
        document.getElementById('custom-link').setCustomValidity("That id is already taken");
    } else {
        document.getElementById('custom-link').setCustomValidity("");
    }
    return res;
}

// Delete a task
async function delete_task(event) {
    document.getElementById(event.target.id.replace("delete-task-button-", "task-div-")).remove();
}

// Add a task
async function add_task() {
    let task_input = document.createElement("input");
    let task_checkbox = document.createElement("input");
    let task_button = document.createElement("button");
    let delete_button = document.createElement("button");

    task_input.type = "text";
    task_input.className = "task-text";
    task_input.placeholder = "Add Task...";
    task_input.minLength = 0;
    task_input.maxLength = 200;

    task_checkbox.type = "checkbox";
    task_checkbox.className = "task-check";

    task_button.className = "add-task-button";
    task_button.type = "button";
    task_button.id = "add-task-button";
    task_button.innerHTML = "+";
    task_button.addEventListener('click', add_task, true);

    delete_button.className = "delete-task-button";
    delete_button.type = "button";
    delete_button.id = "delete-task-button-" + num_tasks;
    delete_button.innerHTML = "-";
    delete_button.addEventListener('click', delete_task, true);

    document.getElementById('task-div-' + num_tasks).appendChild(delete_button);

    document.getElementById('last-active-input').removeEventListener('keyup', add_task, true);
    document.getElementById('last-active-input').id = "task-input-" + num_tasks;
    task_input.id = 'last-active-input';
    num_tasks += 1;
    task_input.addEventListener('keyup', (event) => {
        if (event.code == "Enter" && document.getElementById('last-active-input') == document.activeElement) add_task();
    }, true);

    let task_div = document.createElement("div");
    task_div.className = "task";

    task_div.id = "task-div-" + num_tasks;
    task_checkbox.id = "task-checkbox-" + num_tasks;

    task_div.appendChild(task_checkbox);
    task_div.appendChild(task_input);
    if (document.getElementsByClassName('task').length < 100) {
        task_div.appendChild(task_button);
    }

    document.querySelector(".add-task-button").remove();
    document.querySelector(".task-list").appendChild(task_div);

    document.getElementById('last-active-input').focus();
}
// Add a bunch of listenersto objects

// Prefill date on load
addEventListener('load', prefill_title_date, true);

// Add task
add_task_button.addEventListener('click', add_task, true);

// Delete task
document.getElementById('delete-button').addEventListener('click', delete_task, true);

// Allow Enter as an add task button press alternative
last_active_input.addEventListener('keyup', (event) => {
    if (event.code == "Enter" && last_active_input == document.activeElement) add_task();
}, true);

// Button for save
document.getElementById('save-button').addEventListener('click', async (ev) => {
    res = await updateTodo();
    if (res.status === 200) {
        window.location.href = document.getElementById('custom-link-prefix').innerHTML + (document.getElementById('custom-link').value ? document.getElementById('custom-link').value : id);
    }
}, true);

// Copy link given in box
document.getElementById('copy-todo-link-btn').addEventListener('click', (ev) => {
    var copyText = document.getElementById("todo-link");
    /* Select the text field */
    copyText.focus();
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");

}, true);

// Delete todo button
document.getElementById('delete-button').addEventListener('click', deleteTodo, true);
