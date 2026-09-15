// Assignment 3 form //validation and confirmation

"use strict";

const STORAGE_KEY = "ksmLabsContactForm";
const DESTINATION_EMAIL = "Kaleb_Meador@daytonastate.edu";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        initializeContactForm(contactForm);
    }

    const confirmationDetails =
        document.getElementById("confirmationDetails");

    if (confirmationDetails) {
        initializeConfirmationPage();
    }
});

//input form

function initializeContactForm(form) {
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const birthdateInput = document.getElementById("birthdate");

    setBirthdateLimits(birthdateInput);
    restoreSavedFormData(form);
    updateCharacterCount(messageInput);

    phoneInput.addEventListener("input", function () {
        phoneInput.value =
            formatPhoneNumber(phoneInput.value);

        clearFieldError(phoneInput);
    });

    messageInput.addEventListener("input", function () {
        updateCharacterCount(messageInput);
        clearFieldError(messageInput);
    });

    form.querySelectorAll("input, textarea").forEach(function (field) {
        field.addEventListener("input", function () {
            clearFieldError(field);
        });

        field.addEventListener("blur", function () {
            validateField(field);
        });
    });

    form.addEventListener("reset", function () {
        sessionStorage.removeItem(STORAGE_KEY);

        window.setTimeout(function () {
            clearAllErrors(form);
            updateCharacterCount(messageInput);
        }, 0);
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        clearAllErrors(form);

        if (!validateForm(form)) {
            showFormSummary(
                "Please correct the highlighted fields before continuing."
            );

            const firstInvalidField =
                form.querySelector('[aria-invalid="true"]');

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        const formData = collectFormData();

        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(formData)
        );

        window.location.href = "confirmation.html";
    });
}

//birth date validation

function setBirthdateLimits(input) {
    if (!input) {
        return;
    }

    const today = new Date();
    const oldestDate = new Date();

    oldestDate.setFullYear(
        today.getFullYear() - 120
    );

    input.max = formatDateForInput(today);
    input.min = formatDateForInput(oldestDate);
}

function formatDateForInput(date) {
    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

//form validation

function validateForm(form) {
    let formIsValid = true;

    form.querySelectorAll(
        "input[required], textarea[required]"
    ).forEach(function (field) {
        if (!validateField(field)) {
            formIsValid = false;
        }
    });

    return formIsValid;
}

function validateField(field) {
    const value = field.value.trim();
    let errorMessage = "";

    switch (field.id) {
        case "firstName":
        case "lastName":
            if (value === "") {
                errorMessage =
                    "This name field is required.";
            } else if (
                !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,40}$/.test(value)
            ) {
                errorMessage =
                    "Enter a valid name using letters, spaces, apostrophes, or hyphens.";
            }
            break;

        case "address":
            if (value === "") {
                errorMessage =
                    "A street address is required.";
            } else if (
                !/^\d+[A-Za-z]?\s+[A-Za-z0-9À-ÖØ-öø-ÿ.'# -]{2,}$/.test(value)
            ) {
                errorMessage =
                    "Enter a complete address beginning with a street number.";
            }
            break;

        case "city":
            if (value === "") {
                errorMessage =
                    "A city is required.";
            } else if (
                !/^[A-Za-zÀ-ÖØ-öø-ÿ.' -]{2,50}$/.test(value)
            ) {
                errorMessage =
                    "Enter a valid city name.";
            }
            break;

        case "state":
            if (value === "") {
                errorMessage =
                    "A state abbreviation is required.";
            } else if (!isValidState(value)) {
                errorMessage =
                    "Enter a valid two-letter U.S. state abbreviation.";
            }
            break;

        case "zip":
            if (value === "") {
                errorMessage =
                    "A ZIP code is required.";
            } else if (
                !/^\d{5}(-\d{4})?$/.test(value)
            ) {
                errorMessage =
                    "Enter a 5-digit ZIP code or ZIP+4, such as 12345-6789.";
            }
            break;

        case "phone":
            if (value === "") {
                errorMessage =
                    "A phone number is required.";
            } else if (
                !/^\(\d{3}\)\d{3}-\d{4}$/.test(value)
            ) {
                errorMessage =
                    "Enter a complete phone number in (000)000-0000 format.";
            }
            break;

        case "email":
            if (value === "") {
                errorMessage =
                    "An email address is required.";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value)
            ) {
                errorMessage =
                    "Enter an email address such as name@daytonastate.edu.";
            }
            break;

        case "birthdate":
            errorMessage =
                validateBirthdate(value);
            break;

        case "message":
            if (value === "") {
                errorMessage =
                    "A message is required.";
            } else if (value.length < 2) {
                errorMessage =
                    "Please enter a message containing at least 2 characters.";
            }
            break;

        case "securityAnswer":
            errorMessage =
                validateSecurityAnswer(value);
            break;
    }

    if (errorMessage !== "") {
        showFieldError(field, errorMessage);
        return false;
    }

    clearFieldError(field);
    return true;
}

//birthday validation

function validateBirthdate(value) {
    if (value === "") {
        return "A birth date is required.";
    }

    const selectedDate =
        new Date(`${value}T00:00:00`);

    const today = new Date();

    const oldestReasonableDate =
        new Date();

    today.setHours(0, 0, 0, 0);

    oldestReasonableDate.setFullYear(
        today.getFullYear() - 120
    );

    if (Number.isNaN(selectedDate.getTime())) {
        return "Enter a valid birth date.";
    }

    if (selectedDate > today) {
        return "You can't be born in the future. Please try again.";
    }

    if (selectedDate < oldestReasonableDate) {
        return "Please enter a reasonable birth date.";
    }

    return "";
}

//security validation

function validateSecurityAnswer(value) {
    if (value === "") {
        return "An answer is required.";
    }

    const normalizedAnswer = value
        .trim()
        .toLowerCase()
        .replace(/\./g, "")
        .replace(/\s+/g, " ");

    const validAnswers = [
        "orlando",
        "orlando fl",
        "orlando, fl",
        "orlando florida",
        "orlando, florida"
    ];

    if (!validAnswers.includes(normalizedAnswer)) {
        return "The security answer is incorrect. Please try again.";
    }

    return "";
}

//state validation

function isValidState(value) {
    const validStates = [
        "AL", "AK", "AZ", "AR", "CA",
        "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA",
        "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO",
        "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH",
        "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT",
        "VA", "WA", "WV", "WI", "WY",
        "DC"
    ];

    return validStates.includes(
        value.trim().toUpperCase()
    );
}

//phone number mask
function formatPhoneNumber(value) {
    const digits =
        value.replace(/\D/g, "").slice(0, 10);

    if (digits.length === 0) {
        return "";
    }

    if (digits.length < 4) {
        return `(${digits}`;
    }

    if (digits.length < 7) {
        return (
            `(${digits.slice(0, 3)})` +
            `${digits.slice(3)}`
        );
    }

    return (
        `(${digits.slice(0, 3)})` +
        `${digits.slice(3, 6)}-` +
        `${digits.slice(6)}`
    );
}

//error message
function showFieldError(field, message) {
    const errorElement =
        document.getElementById(
            `${field.id}Error`
        );

    field.classList.add("invalid-field");

    field.setAttribute(
        "aria-invalid",
        "true"
    );

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(field) {
    const errorElement =
        document.getElementById(
            `${field.id}Error`
        );

    field.classList.remove("invalid-field");
    field.removeAttribute("aria-invalid");

    if (errorElement) {
        errorElement.textContent = "";
    }
}

function clearAllErrors(form) {
    form.querySelectorAll(
        "input, textarea"
    ).forEach(function (field) {
        clearFieldError(field);
    });

    const summary =
        document.getElementById("formSummary");

    if (summary) {
        summary.hidden = true;
        summary.textContent = "";
    }
}

function showFormSummary(message) {
    const summary =
        document.getElementById("formSummary");

    if (summary) {
        summary.textContent = message;
        summary.hidden = false;
    }
}

//message character count

function updateCharacterCount(messageInput) {
    const characterCount =
        document.getElementById("characterCount");

    if (messageInput && characterCount) {
        characterCount.textContent =
            `${messageInput.value.length} / 1000`;
    }
}

//collect form data
function collectFormData() {
    return {
        firstName:
            document.getElementById("firstName")
                .value.trim(),

        lastName:
            document.getElementById("lastName")
                .value.trim(),

        address:
            document.getElementById("address")
                .value.trim(),

        city:
            document.getElementById("city")
                .value.trim(),

        state:
            document.getElementById("state")
                .value.trim()
                .toUpperCase(),

        zip:
            document.getElementById("zip")
                .value.trim(),

        phone:
            document.getElementById("phone")
                .value.trim(),

        email:
            document.getElementById("email")
                .value.trim(),

        birthdate:
            document.getElementById("birthdate")
                .value,

        message:
            document.getElementById("message")
                .value.trim()
    };
}

function restoreSavedFormData(form) {
    const savedData = getSavedFormData();

    if (!savedData) {
        return;
    }

    Object.keys(savedData).forEach(function (key) {
        const field =
            form.querySelector(`#${key}`);

        if (field) {
            field.value = savedData[key];
        }
    });
}

function getSavedFormData() {
    const storedData =
        sessionStorage.getItem(STORAGE_KEY);

    if (!storedData) {
        return null;
    }

    try {
        return JSON.parse(storedData);
    } catch (error) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

//confirmation page

function initializeConfirmationPage() {
    const formData = getSavedFormData();

    const details =
        document.getElementById("confirmationDetails");

    const noFormData =
        document.getElementById("noFormData");

    const buttons =
        document.getElementById("confirmationButtons");

    const editButton =
        document.getElementById("editButton");

    const confirmButton =
        document.getElementById("confirmButton");

    const mailtoNotice =
        document.getElementById("mailtoNotice");

    if (!formData) {
        noFormData.hidden = false;
        details.hidden = true;
        buttons.hidden = true;
        mailtoNotice.hidden = true;
        return;
    }

    const confirmationItems = [
        [
            "Name",
            `${formData.firstName} ${formData.lastName}`
        ],
        [
            "Address",
            formData.address
        ],
        [
            "City, State and ZIP",
            `${formData.city}, ${formData.state} ${formData.zip}`
        ],
        [
            "Phone",
            formData.phone
        ],
        [
            "Email",
            formData.email
        ],
        [
            "Birth date",
            formatDisplayDate(formData.birthdate)
        ],
        [
            "Message",
            formData.message
        ]
    ];

    confirmationItems.forEach(function (item) {
        const term =
            document.createElement("dt");

        const description =
            document.createElement("dd");

        term.textContent = item[0];
        description.textContent = item[1];

        details.appendChild(term);
        details.appendChild(description);
    });

    editButton.addEventListener("click", function () {
        window.location.href = "assignment3.html";
    });

    confirmButton.addEventListener("click", function () {
        sendWithEmailClient(formData);
    });
}

//display date

function formatDisplayDate(dateString) {
    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

///email function

function sendWithEmailClient(formData) {
    const subject = encodeURIComponent(
        `KSM Labs Form Submission - ` +
        `${formData.firstName} ${formData.lastName}`
    );

    const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\n` +
        `Address: ${formData.address}\n` +
        `City: ${formData.city}\n` +
        `State: ${formData.state}\n` +
        `ZIP Code: ${formData.zip}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Birth Date: ${formData.birthdate}\n\n` +
        `Message:\n${formData.message}`
    );

    const mailtoLink =
        `mailto:${DESTINATION_EMAIL}` +
        `?subject=${subject}&body=${body}`;

    sessionStorage.removeItem(STORAGE_KEY);

    window.location.href = mailtoLink;
}