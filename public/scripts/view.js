var title_text_input = document.getElementById('landing-todo');
var add_task_button = document.getElementById('add-task-button');
var last_active_input = document.getElementById('last-active-input');
var id = undefined;

var num_tasks = 0;

var pageURL = window.location.href;
var id = pageURL.substr(pageURL.lastIndexOf('/') + 1);

async function getTodo() {
    // Get data and save
    let res = await fetch('http://localhost:3000/api/v1/todo/' + id, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'GET',
    });
    js = await res.json();
    document.getElementById('todo-title-input').value = js.title;
    document.getElementById('todo-desc-input').value = js.desc;
    js.tasks.forEach(task => {
        let task_input = document.createElement("input");
        let task_checkbox = document.createElement("input");

        task_input.type = "text";
        task_input.className = "task-text";
        task_input.value = task.body;

        task_checkbox.type = "checkbox";
        task_checkbox.className = "task-check";
        task_checkbox.checked = task.done;

        num_tasks += 1
        
        let task_div = document.createElement("div");
        task_div.className = "task";

        task_div.id = "task-div-" + num_tasks;
        task_checkbox.id = "task-checkbox-" + num_tasks;

        task_div.appendChild(task_checkbox);
        task_div.appendChild(task_input);

        document.querySelector(".task-list").appendChild(task_div);
    });

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


    // Get details of todo and display
}

async function generatePayload() {
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
        id: id,
    }
    return payload;
}

async function updateTodo() {
    // Get data and save
    let res = await fetch('http://localhost:3000/api/v1/todo', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(await generatePayload()),
    });
}

async function add_task() {
    // Other shit
    // await updateTodo();
    let task_input = document.createElement("input");
    let task_checkbox = document.createElement("input");
    let task_button = document.createElement("button");

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

addEventListener('load', getTodo, true);

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