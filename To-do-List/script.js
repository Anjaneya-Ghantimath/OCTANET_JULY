const taskInput = document.querySelector(".task-input input"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Function to display todos
function showTodo() {
    let liTag = "";
    todos.forEach((todo, id) => {
        let completed = todo.status === "completed" ? "checked" : "";
        liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id})'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
    });

    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

// Function to show the task menu
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Function to update task status
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    todos[selectedTask.id].status = selectedTask.checked ? "completed" : "pending";
    taskName.classList.toggle("checked", selectedTask.checked);
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Function to edit a task
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// Function to delete a task
function deleteTask(deleteId) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
}

// Event listener for clearing all tasks
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

// Event listener for adding or editing tasks
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key === "Enter" && userTask) {
        if (!isEditTask) {
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            todos[editId].name = userTask;
            isEditTask = false;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo();
    }
});

// Initial call to display tasks
showTodo();
