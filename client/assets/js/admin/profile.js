import { getCurrentAdmin } from "./global.js";

const API_URL = "http://127.0.0.1:3000";

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

function showFeedback(message, type = "success") {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  setTimeout(() => {
    feedbackEl.className = "feedback";
  }, 4000);
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
      showFeedback(data.message || "Failed to update profile.", "error");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    showFeedback("An error occurred while saving your changes.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", loadProfile);
