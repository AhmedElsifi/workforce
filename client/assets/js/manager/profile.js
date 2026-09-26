import { API_URL } from "../config.js";
import { getCurrentEmployee, toTitleCase } from "./global.js";

const EM_DASH = "—";

const editableFields = {
  fname: document.getElementById("fname"),
  lname: document.getElementById("lname"),
};

const readOnlyFields = {
  position: document.getElementById("view-position"),
  department: document.getElementById("view-department"),
  role: document.getElementById("view-role"),
  salary: document.getElementById("view-salary"),
  employmentStatus: document.getElementById("view-status"),
};

function formatSalary(salary) {
  return typeof salary === "number"
    ? `$${salary.toLocaleString("en-US")}`
    : EM_DASH;
}

function displayValue(value) {
  return toTitleCase(value) || EM_DASH;
}

function renderReadOnlyFields(employee) {
  readOnlyFields.position.textContent = displayValue(employee?.position);
  readOnlyFields.role.textContent = displayValue(employee?.role);
  readOnlyFields.salary.textContent = formatSalary(employee?.salary);
  readOnlyFields.employmentStatus.textContent = displayValue(
    employee?.employmentStatus,
  );
  readOnlyFields.department.textContent = displayValue(employee?.department);
}

function renderUnavailable() {
  for (const field of Object.values(readOnlyFields)) {
    field.textContent = EM_DASH;
  }
}

function showInlineError(field, message) {
  field.setCustomValidity(message);
  field.reportValidity();
}

function clearInlineError(field) {
  field.setCustomValidity("");
}

function validateForm() {
  const errors = {};
  const fname = editableFields.fname.value.trim();
  const lname = editableFields.lname.value.trim();
  const password = document.getElementById("password").value;

  if (!fname) errors.fname = "First name is required";
  else if (fname.length < 2) errors.fname = "First name must be at least 2 characters";
  else if (fname.length > 50) errors.fname = "First name must be at most 50 characters";

  if (!lname) errors.lname = "Last name is required";
  else if (lname.length < 2) errors.lname = "Last name must be at least 2 characters";
  else if (lname.length > 50) errors.lname = "Last name must be at most 50 characters";

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

async function initProfile() {
  try {
    const employee = await getCurrentEmployee();

    editableFields.fname.value = employee?.fname ?? "";
    editableFields.lname.value = employee?.lname ?? "";
    document.getElementById("email").value = employee?.email ?? "";

    renderReadOnlyFields(employee);
  } catch (error) {
    console.error("Could not load the manager profile:", error);
    renderUnavailable();
  }
}

const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  [editableFields.fname, editableFields.lname, document.getElementById("password")].forEach(
    clearInlineError,
  );

  const errors = validateForm();
  const firstKey = Object.keys(errors)[0];
  if (firstKey) {
    const field =
      firstKey === "password"
        ? document.getElementById("password")
        : editableFields[firstKey];
    showInlineError(field, errors[firstKey]);
    return;
  }

  const fname = editableFields.fname.value.trim();
  const lname = editableFields.lname.value.trim();
  const password = document.getElementById("password").value;

  const payload = { fname, lname };
  if (password) {
    payload.password = password;
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
      alert(data.message || "Profile updated successfully!");
      document.getElementById("password").value = "";
      initProfile();
    } else {
      const apiErrors = data?.errors || {};
      const firstError = Object.values(apiErrors).find(
        (m) => typeof m === "string",
      );
      alert(firstError || data?.message || "Failed to update profile. Please try again.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while trying to save your changes.");
  }
});

initProfile();