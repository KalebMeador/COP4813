// JavaScript for the website navigation

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const dropdown =
        document.getElementById("assignmentsDropdown");

    const dropdownButton =
        document.getElementById("assignmentsButton");

    if (!dropdown || !dropdownButton) {
        return;
    }

    //wait two seconds before closing the dropdown

    const closeDelay = 2000;
    let closeTimer;

    function openDropdown() {
        clearTimeout(closeTimer);

        dropdown.classList.add("open");

        dropdownButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    function closeDropdown() {
        clearTimeout(closeTimer);

        dropdown.classList.remove("open");

        dropdownButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function startCloseTimer() {
        clearTimeout(closeTimer);

        closeTimer = setTimeout(function () {
            closeDropdown();
        }, closeDelay);
    }

    //hover opens drop down

    dropdown.addEventListener("mouseenter", function () {
        openDropdown();
    });

    //initiate 2 second timer for dropdown

    dropdown.addEventListener("mouseleave", function () {
        startCloseTimer();
    });

    //clicking the button opens or closes the dropdown

    dropdownButton.addEventListener("click", function () {
        if (dropdown.classList.contains("open")) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    //open the dropdown down-arrow key

    dropdownButton.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openDropdown();

            const firstMenuLink =
                dropdown.querySelector(".dropdown-menu a");

            if (firstMenuLink) {
                firstMenuLink.focus();
            }
        }
    });

    //esc key closes the dropdown

    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            dropdown.classList.contains("open")
        ) {
            closeDropdown();
            dropdownButton.focus();
        }
    });

    //clicking closes dropdown

    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target)) {
            closeDropdown();
        }
    });
});