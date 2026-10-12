function initializeBoard() {
    const form = document.getElementById("taskForm");
    const input = document.getElementById("taskInput");
    const message = document.getElementById("message");
    const columns = document.querySelectorAll(".column");

    let nextId = 1;
    let draggedCard = null;

    function updateCounts() {
        columns.forEach(function (column) {
            const count = column.querySelectorAll(".task").length;
            column.querySelector(".count").textContent = count;
        });
    }

    function clearHighlights() {
        columns.forEach(function (column) {
            column.classList.remove("drag-over");
        });
    }

    //add card
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = input.value.trim();

        if (text === "") {
            message.textContent = "Enter a task first.";
            input.focus();
            return;
        }

        const card = document.createElement("div");
        card.className = "task";
        card.id = "task-" + nextId++;
        card.draggable = true;

         
        const icon = document.createElement("img");
        icon.src = "data:image/svg+xml," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" ' +
            'width="24" height="24" viewBox="0 0 24 24">' +
            '<rect x="4" y="2" width="16" height="20" rx="3" ' +
            'fill="none" stroke="#202329" stroke-width="2"/>' +
            '<path d="M8 8h8M8 12h8M8 16h5" ' +
            'stroke="#202329" stroke-width="2"/></svg>'
        );
        icon.alt = "";
        icon.draggable = false;
        icon.width = 24;
        icon.height = 24;

        const label = document.createElement("span");
        label.textContent = text;

        card.append(icon, label);

        //drag
        card.addEventListener("dragstart", function (event) {
            draggedCard = card;
            event.dataTransfer.setData("text/plain", card.id);
            event.dataTransfer.effectAllowed = "move";
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", function () {
            draggedCard = null;
            card.classList.remove("dragging");
            clearHighlights();
        });

        document.getElementById("todoTasks").appendChild(card);

        updateCounts();
        message.textContent = '"' + text + '" added to To Do.';

        input.value = "";
        input.focus();
    });

    columns.forEach(function (column) {
        //drop
        column.addEventListener("dragover", function (event) {
            if (!draggedCard) return;

            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            column.classList.add("drag-over");
        });

        column.addEventListener("dragleave", function (event) {
            if (!column.contains(event.relatedTarget)) {
                column.classList.remove("drag-over");
            }
        });

        //drop
        column.addEventListener("drop", function (event) {
            event.preventDefault();
            clearHighlights();

            if (!draggedCard) return;

            const id = event.dataTransfer.getData("text/plain");
            if (id !== draggedCard.id) return;

            const taskList = column.querySelector(".task-list");
            const text = draggedCard.querySelector("span").textContent;
            const sameColumn = draggedCard.parentElement === taskList;

            taskList.appendChild(draggedCard);
            draggedCard.classList.remove("dragging");

            message.textContent =
                'Drop captured: "' + text + '"' +
                (sameColumn ? " is already in " : " moved to ") +
                column.dataset.name + ".";

            draggedCard = null;
            updateCounts();
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBoard);
} else {
    initializeBoard();
}