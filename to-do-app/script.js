const aniga = document.getElementById('New task');
const input = document.getElementById("New task");
const taskList = document.getElementById("tasklist");

// Load tasks from LocalStorage on page load
window.onload = loadTasks;

// Add task when button is clicked
function addtask() {
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskText;

  // Create delete button
  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = "🗑️";
  deleteBtn.classList.add("delete-btn");

  // Mark as done
  li.addEventListener("click", () => {
    li.classList.toggle("done");
    saveTasks();
  });

  // Delete task
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  input.value = "";

  saveTasks();
}

// Add task with Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addtask();
});

// Save all tasks to LocalStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#tasklist li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent,
      done: li.classList.contains("done"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from LocalStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.done) li.classList.add("done");

    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
      saveTasks();
    });

    li.addEventListener("click", () => {
      li.classList.toggle("done");
      saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Clear all tasks
function clearAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
  }
}
