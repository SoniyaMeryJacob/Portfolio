const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccessMessage");
const savedContactData = {};
window.savedContactData = savedContactData;

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Name must be between 2 and 50 characters.",
  },
  email: {
    required: true,
    type: "email",
    message: "Please enter a valid email address.",
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100,
    message: "Subject must be between 5 and 100 characters.",
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "Message must be between 10 and 500 characters.",
  },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldState(field, isValid, errorText = "") {
  const errorElement = field.parentElement.querySelector(".error-message");

  if (!isValid) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
    errorElement.textContent = errorText;
    return;
  }

  field.classList.remove("is-invalid");
  field.classList.add("is-valid");
  errorElement.textContent = "";
}

function validateField(field) {
  const { name, value } = field;
  const rule = validationRules[name];
  const trimmedValue = value.trim();

  if (!rule) return true;

  if (rule.required && trimmedValue === "") {
    setFieldState(
      field,
      false,
      `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
    );
    return false;
  }

  if (rule.type === "email" && !emailPattern.test(trimmedValue)) {
    setFieldState(field, false, "Please enter a valid email format.");
    return false;
  }

  if (rule.minLength && trimmedValue.length < rule.minLength) {
    setFieldState(field, false, rule.message);
    return false;
  }

  if (rule.maxLength && trimmedValue.length > rule.maxLength) {
    setFieldState(field, false, rule.message);
    return false;
  }

  setFieldState(field, true);
  return true;
}

function clearSuccessMessage() {
  successMessage.textContent = "";
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearSuccessMessage();

  let isFormValid = true;
  const formData = {};

  Array.from(contactForm.elements).forEach((element) => {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      )
    ) {
      return;
    }

    if (element.name) {
      const isFieldValid = validateField(element);
      isFormValid = isFormValid && isFieldValid;

      if (isFieldValid) {
        formData[element.name] = element.value.trim();
      }
    }
  });

  if (!isFormValid) {
    successMessage.textContent = "";
    return;
  }

  Object.keys(savedContactData).forEach((key) => delete savedContactData[key]);
  Object.assign(savedContactData, formData);
  window.savedContactData = savedContactData;

  console.log("Form submitted successfully:", savedContactData);
  successMessage.textContent = "Your message has been sent successfully!";
  contactForm.reset();

  Array.from(contactForm.elements).forEach((element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      element.classList.remove("is-valid", "is-invalid");
      const errorElement =
        element.parentElement.querySelector(".error-message");
      if (errorElement) {
        errorElement.textContent = "";
      }
    }
  });
});

contactForm.addEventListener("input", function (event) {
  const field = event.target;

  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    if (field.name) {
      validateField(field);
    }
  }
});

contactForm.addEventListener(
  "blur",
  function (event) {
    const field = event.target;

    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      if (field.name) {
        validateField(field);
      }
    }
  },
  true,
);
