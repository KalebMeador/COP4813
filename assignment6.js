"use strict";

// load the external json file
async function loadSecurityTools() {
    const statusMessage = document.getElementById("toolsStatus");
    const tableBody = document.getElementById("toolsTableBody");
    const tableContainer = document.getElementById("toolsTableContainer");

    try {
        const response = await fetch("securitytools.json", {
            cache: "no-store"
        });

        // check whether the file loaded successfully
        if (!response.ok) {
            throw new Error("Unable to load securitytools.json.");
        }

        // parse the json text into a javascript object
        const jsonText = await response.text();
        const data = JSON.parse(jsonText);

        if (!Array.isArray(data.tools)) {
            throw new Error("The JSON file must contain a tools array.");
        }

        const rows = document.createDocumentFragment();

        // create a table row for each tool
        data.tools.forEach(function (tool) {
            const fields = [
                "name",
                "category",
                "description",
                "blueTeamUse",
                "website"
            ];

            // check that each tool contains the required text fields
            if (!tool || fields.some(function (field) {
                return typeof tool[field] !== "string"
                    || !tool[field].trim();
            })) {
                throw new Error("A tool is missing a required text field.");
            }

            const website = new URL(tool.website);

            if (website.protocol !== "https:"
                && website.protocol !== "http:") {
                throw new Error("Invalid website address.");
            }

            const row = document.createElement("tr");

            const nameCell = document.createElement("th");
            nameCell.scope = "row";
            nameCell.textContent = tool.name;
            row.appendChild(nameCell);

            const textFields = [
                "category",
                "description",
                "blueTeamUse"
            ];

            textFields.forEach(function (field) {
                const cell = document.createElement("td");
                cell.textContent = tool[field];
                row.appendChild(cell);
            });

            // add a link to the official website
            const websiteCell = document.createElement("td");
            const websiteLink = document.createElement("a");

            websiteLink.href = website.href;
            websiteLink.textContent = "Visit " + tool.name;

            websiteCell.appendChild(websiteLink);
            row.appendChild(websiteCell);

            rows.appendChild(row);
        });

        // display the completed table
        tableBody.replaceChildren(rows);
        tableContainer.hidden = data.tools.length === 0;

        statusMessage.textContent = data.tools.length === 0
            ? "No security tools are listed yet."
            : data.tools.length + " security tools loaded.";

    } catch (error) {
        tableContainer.hidden = true;
        statusMessage.classList.add("is-error");

        statusMessage.textContent =
            "Security tools could not be loaded. Please try again later.";

        console.error("Security tools loading error:", error);
    }
}

loadSecurityTools();