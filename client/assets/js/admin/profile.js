import { getCurrentAdmin } from "./global.js";
import { API_URL } from "../config.js";

const feedbackEl = document.getElementById("profile-feedback");
const form = document.getElementById("profileForm");
const submitBtn = document.querySelector("button[form='profileForm']");

const fields = {
  fname: document.getElementById("fname"),
  lname: document.getElementById("lname"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  position: document.getElementById("position"),
  role: document.getElementById("role"),
  salary: document.getElementById("salary"),
  employmentStatus: document.getElementById("employmentStatus"),
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFeedback(message, type = "success") {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  if (type === "success") {
    setTimeout(() => {
      feedbackEl.className = "feedback";
    }, 4000);
  }
}

function clearFeedback() {
  feedbackEl.className = "feedback";
  feedbackEl.textContent = "";
}

function validateForm() {
  const errors = {};

  const fname = fields.fname.value.trim();
  const lname = fields.lname.value.trim();
  const email = fields.email.value.trim();
  const password = fields.password.value;
  const salary = fields.salary.value;

  if (!fname) errors.fname = "First name is required";
  else if (fname.length < 2) errors.fname = "First name must be at least 2 characters";

  if (!lname) errors.lname = "Last name is required";
  else if (lname.length < 2) errors.lname = "Last name must be at least 2 characters";

  if (!email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Invalid email format";

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (salary !== "") {
    const n = Number(salary);
    if (!Number.isFinite(n) || n < 0) {
      errors.salary = "Salary must be a non-negative number";
    }
  }

  return errors;
}

function showFieldErrors(errors) {
  // Clear previous error state
  for (const key of Object.keys(fields)) {
    const el = fields[key];
    el.setCustomValidity?.("");
  }

  const firstKey = Object.keys(errors)[0];
  if (firstKey && fields[firstKey]) {
    fields[firstKey].setCustomValidity(errors[firstKey]);
    fields[firstKey].reportValidity();
  }
}

async function loadProfile() {
  try {
    const admin = await getCurrentAdmin();

    fields.fname.value = admin?.fname ?? "";
    fields.lname.value = admin?.lname ?? "";
    fields.email.value = admin?.email ?? "";
    fields.position.value = admin?.position ?? "";
    fields.role.value = admin?.role ?? "admin";
    fields.salary.value = admin?.salary ?? "";
    fields.employmentStatus.value = admin?.employmentStatus ?? "active";
  } catch (error) {
    console.error("Failed to load profile:", error);
    showFeedback("Could not load profile data.", "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFeedback();

  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    showFieldErrors(errors);
    showFeedback("Please fix the highlighted fields.", "error");
    return;
  }

  submitBtn.disabled = true;

  const payload = {
    fname: fields.fname.value.trim(),
    lname: fields.lname.value.trim(),
    email: fields.email.value.trim(),
    role: fields.role.value,
    employmentStatus: fields.employmentStatus.value,
  };

  if (fields.position.value.trim()) {
    payload.position = fields.position.value.trim();
  }

  if (fields.salary.value !== "") {
    payload.salary = Number(fields.salary.value);
  }

  if (fields.password.value) {
    payload.password = fields.password.value;
  }

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      fields.password.value = "";
      showFeedback(data.message || "Profile updated successfully.", "success");
    } else {
      const apiErrors = data?.errors || {};
      const messages = Object.values(apiErrors).filter(
        (m) => typeof m === "string",
      );
      showFeedback(
        messages[0] || data?.message || "Failed to update profile.",
        "error",
      );
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    showFeedback("An error occurred while saving your changes.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", loadProfile);