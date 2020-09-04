var title_text_input = document.getElementById('landing-todo');
var add_task_button = document.getElementById('add-task-button');
var last_active_input = document.getElementById('last-active-input');
var id = undefined;

var num_tasks = 1;

async function prefill_title_date() {
    await new Promise(r => setTimeout(r, 3000));
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

async function generatePayload(updating) {
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

    payload = {
        title: title,
        desc: desc,
        tasks: tasks,
    }

    if (updating && id) {
        payload.id = id;
    }

    return payload;
}

async function createTodo() {
    // Get data and save
    let res = await fetch('./api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify(await generatePayload(false)),
    });
    js = await res.json();
    id = js._id;
    console.log(id);
    document.getElementById("todo-link").value = `${window.location.href}todo/${id}`;
}

async function deleteTodo() {
    // Get data and save
    let res = await fetch('./api/v1/todo/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'DELETE',
    });
    location.href = '.';
}

async function updateTodo() {
    // Get data and save
    let res = await fetch('./api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(await generatePayload(true)),
    });
}


async function delete_task(event) {
    document.getElementById(event.target.id.replace("delete-task-button-", "task-div-")).remove();
}

async function add_task() {
    // Other shit
    // await updateTodo();
    let task_input = document.createElement("input");
    let task_checkbox = document.createElement("input");
    let task_button = document.createElement("button");
    let delete_button = document.createElement("button");

    task_input.type = "text";
    task_input.className = "task-text";
    task_input.placeholder = "Task";

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
    task_div.appendChild(task_button);

    document.querySelector(".add-task-button").remove();
    document.querySelector(".task-list").appendChild(task_div);

    document.getElementById('last-active-input').focus();
}

addEventListener('load', prefill_title_date, true);

add_task_button.addEventListener('click', add_task, true);
document.getElementById('delete-button').addEventListener('click', delete_task, true);

last_active_input.addEventListener('keyup', (event) => {
    if (event.code == "Enter" && last_active_input == document.activeElement) add_task();
}, true);

document.getElementById('save-button').addEventListener('click', updateTodo, true);

document.getElementById('copy-todo-link-btn').addEventListener('click', (ev) => {
    var copyText = document.getElementById("todo-link");
    /* Select the text field */
    copyText.focus();
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    console.log(document.execCommand("copy"));
    console.log('oook');
}, true);

document.getElementById('delete-button').addEventListener('click', deleteTodo, true);