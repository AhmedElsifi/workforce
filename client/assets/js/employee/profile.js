import { getCurrentEmployee, toTitleCase } from "./global.js";

const EM_DASH = "—";

const editableFields = {
  fname: document.getElementById("fname"),
  lname: document.getElementById("lname"),
  email: document.getElementById("email"),
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

  // `/auth/me` does not expose the department name (it is stored as a
  // reference), so the field degrades to a placeholder rather than printing
  // a raw identifier.
  readOnlyFields.department.textContent = displayValue(employee?.department);
}

function renderUnavailable() {
  for (const field of Object.values(readOnlyFields)) {
    field.textContent = EM_DASH;
  }
}

async function initProfile() {
  try {
    const employee = await getCurrentEmployee();

    // Editable inputs keep the stored values verbatim so nothing is
    // accidentally reformatted on save.
    editableFields.fname.value = employee?.fname ?? "";
    editableFields.lname.value = employee?.lname ?? "";
    editableFields.email.value = employee?.email ?? "";

    renderReadOnlyFields(employee);
  } catch (error) {
    console.error("Could not load the employee profile:", error);
    renderUnavailable();
  }
}

initProfile();
