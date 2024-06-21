const URL = "https://6672687a6ca902ae11b02471.mockapi.io/newtodo";

document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});

const myForm = document.getElementById("myForm");
myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const task = document.getElementById("task").value.trim();
    const date = document.getElementById("date").value;

    if (!username || !task || !date) {
        alert("Please fill out all fields");
        return;
    }

    const data = {
        username,
        task,
        date,
        status: "initiated",
    };

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        alert("Updated successfully");
        createCard(data);
    })
    .catch((error) => {
        console.error("Error:", error);
    })
    .finally(() => {
        myForm.reset();
    });
});

function fetchTasks() {
    fetch(URL)
        .then((response) => response.json())
        .then((tasks) => {
            tasks.forEach(createCard);
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
        });
}

function createCard(data) {
    const cardContainer = document.getElementById("card-container");

    const cardCol = document.createElement("div");
    cardCol.className = "col-sm-4 mb-3"; 

    const card = document.createElement("div");
    card.className = `card ${data.status}`;
    card.dataset.id = data.id;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerText = `Username: ${data.username}`;

    const cardTextTask = document.createElement("p");
    cardTextTask.className = "card-text";
    cardTextTask.innerText = `Task: ${data.task}`;

    const cardTextDate = document.createElement("p");
    cardTextDate.className = "card-text";
    cardTextDate.innerText = `Date: ${data.date}`;

    const cardStatus = document.createElement("p");
    cardStatus.className = "card-text";
    cardStatus.innerText = `Status: ${data.status}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger mt-2";
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteTask(data.id, cardCol);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTextTask);
    cardBody.appendChild(cardTextDate);
    cardBody.appendChild(cardStatus);
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);
    cardCol.appendChild(card);
    cardContainer.appendChild(cardCol);

    card.addEventListener("click", () => {
        toggleStatus(card, cardStatus, data);
    });
}

function toggleStatus(card, cardStatus, data) {
    if (card.classList.contains("initiated")) {
        card.classList.remove("initiated");
        card.classList.add("pending");
        cardStatus.innerText = "Status: pending";
        data.status = "pending";
    } else if (card.classList.contains("pending")) {
        card.classList.remove("pending");
        card.classList.add("completed");
        cardStatus.innerText = "Status: completed";
        data.status = "completed";
    } else if (card.classList.contains("completed")) {
        card.classList.remove("completed");
        card.classList.add("initiated");
        cardStatus.innerText = "Status: initiated";
        data.status = "initiated";
    }
    updateTask(data);
}

function updateTask(updatedTask) {
    fetch(`${URL}/${updatedTask.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Task updated:", data);
    })
    .catch((error) => {
        console.error("Error updating task:", error);
    });
}

function deleteTask(id, cardElement) {
    fetch(`${URL}/${id}`, {
        method: "DELETE",
    })
    .then(() => {
        cardElement.remove();
        alert("Task deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting task:", error);
    });
}
