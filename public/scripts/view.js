var title_text_input = document.getElementById('landing-todo');
var add_task_button = document.getElementById('add-task-button');
var last_active_input = document.getElementById('last-active-input');
// Get the elements that we will change

// Global vars
var id = undefined;
var num_tasks = 0;

// Get the id of the todo
var pageURL = window.location.href;
var id = pageURL.substr(pageURL.lastIndexOf('/') + 1);

// Set the text for the custom link prefix
document.getElementById('custom-link-prefix').innerHTML = window.location.href.replace(id, "");

// Get todo and update the page elements
async function getTodo() {
    document.getElementById("todo-link").value = window.location.href;
    let res = await fetch('/api/v1/todo/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'GET',
    });

    js = await res.json();
    document.getElementById('todo-title-input').value = js.title;
    document.getElementById('todo-desc-input').value = js.desc;

    document.getElementById("private-checkbox").checked = js.private;

    js.tasks.forEach(task => {
        let task_input = document.createElement("input");
        let task_checkbox = document.createElement("input");
        let delete_button = document.createElement("button");

        task_input.type = "text";
        task_input.className = "task-text";
        task_input.value = task.body;
        task_input.placeholder = "Add Task...";

        task_checkbox.type = "checkbox";
        task_checkbox.className = "task-check";
        task_checkbox.checked = task.done;
        num_tasks += 1


        delete_button.className = "delete-task-button";
        delete_button.type = "button";
        delete_button.id = "delete-task-button-" + num_tasks;
        delete_button.innerHTML = "-";
        delete_button.addEventListener('click', delete_task, true);
    

        let task_div = document.createElement("div");
        task_div.className = "task";

        task_div.id = "task-div-" + num_tasks;
        task_checkbox.id = "task-checkbox-" + num_tasks;

        task_div.appendChild(task_checkbox);
        task_div.appendChild(task_input);
        task_div.appendChild(delete_button);
    

        document.querySelector(".task-list").appendChild(task_div);
    });

    document.querySelector(".task-list").lastChild.lastChild.remove();
    document.querySelector(".task-list").lastChild.lastChild.id = "last-active-input";

    let task_button = document.createElement("button");

    task_button.className = "add-task-button";
    task_button.type = "button";
    task_button.id = "add-task-button";
    task_button.innerHTML = "+";
    task_button.addEventListener('click', add_task, true);


    document.getElementById('last-active-input').addEventListener('keyup', (event) => {
        if (event.code == "Enter" && document.getElementById('last-active-input') == document.activeElement) add_task();
    }, true);

    document.querySelector(".task-list").lastChild.appendChild(task_button);
}

// Generate the body of the requests we will make
// NewID is for when the todo is being moved to a new id
async function generatePayload(newID) {
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
        id: id,
        private: priv,
    }

    if (newID) {
        payload.nid = newID;
    }
    return payload;
}

// Update the todo
async function updateTodo() {
    let newID = document.getElementById('custom-link').value;
    let res = await fetch('/api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(await generatePayload(newID ? newID : false)),
    });
    if (res.status === 400) {
        document.getElementById('custom-link').setCustomValidity("That id is already taken");
    } else {
        document.getElementById('custom-link').setCustomValidity("");
    }
    return res;
}

// Delete todo
async function deleteTodo() {
    let res = await fetch('/api/v1/todo/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'DELETE',
    });
    location.href = '/';
}

// Add task
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

// Delete a task
async function delete_task(event) {
    document.getElementById(event.target.id.replace("delete-task-button-", "task-div-")).remove();
}

// Prefill data on load
addEventListener('load', getTodo, true);

// Delete task
document.getElementById('delete-button').addEventListener('click', delete_task, true);

// Save task
document.getElementById('save-button').addEventListener('click', async (ev) => {
    res = await updateTodo();
    if (res.status === 200) {
        window.location.href = document.getElementById('custom-link-prefix').innerHTML + (document.getElementById('custom-link').value ? document.getElementById('custom-link').value : id);
    }
}, true);

// Copy text in link input
document.getElementById('copy-todo-link-btn').addEventListener('click', (ev) => {
    var copyText = document.getElementById("todo-link");
    /* Select the text field */
    copyText.focus();
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
}, true);

// Delete todo
document.getElementById('delete-button').addEventListener('click', deleteTodo, true);
