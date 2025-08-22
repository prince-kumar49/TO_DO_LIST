// script.js
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDate");
  const priorityInput = document.getElementById("priority");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const filter = document.getElementById("filter");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Add Task
  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (taskText) {
      tasks.push({ text: taskText, completed: false, dueDate, priority });
      taskInput.value = "";
      dueDateInput.value = "";
      priorityInput.value = "Low";
      saveTasks();
      renderTasks();
    }
  });

  // Filter tasks
  filter.addEventListener("change", renderTasks);

  // Render tasks
  function renderTasks() {
    taskList.innerHTML = "";
    let filteredTasks = tasks;

    if (filter.value === "completed") {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (filter.value === "pending") {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter.value === "high") {
      filteredTasks = tasks.filter(t => t.priority === "High");
    }

    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.textContent = `${task.text} (Due: ${task.dueDate || "No date"})`;

      // Priority styling
      if (task.priority === "High") li.classList.add("priority-high");
      if (task.priority === "Medium") li.classList.add("priority-medium");
      if (task.priority === "Low") li.classList.add("priority-low");

      if (task.completed) {
        li.classList.add("completed");
      }

      // Toggle complete
      li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.classList.add("editBtn");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newTask = prompt("Edit task:", task.text);
        if (newTask !== null && newTask.trim() !== "") {
          tasks[index].text = newTask.trim();
          saveTasks();
          renderTasks();
        }
      });

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
