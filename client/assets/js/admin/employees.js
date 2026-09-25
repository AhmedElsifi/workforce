import { API_URL } from "../config.js";

const tableBody = document.getElementById("employees-table-body");
const emptyState = document.getElementById("employees-empty");
const feedback = document.getElementById("employees-feedback");
const tableWrapper = document.querySelector(".table-wrapper");

const searchInput = document.getElementById("search-input");
const departmentFilter = document.getElementById("department-filter");
const roleFilter = document.getElementById("role-filter");
const statusFilter = document.getElementById("status-filter");

const addBtn = document.getElementById("add-employee-btn");
const addModal = document.getElementById("add-employee-modal");
const addForm = document.getElementById("add-employee-form");
const addCloseBtn = document.getElementById("add-modal-close-btn");
const addCancelBtn = document.getElementById("add-cancel-btn");
const addDepartmentSelect = document.getElementById("add-department");

const editModal = document.getElementById("edit-employee-modal");
const editForm = document.getElementById("edit-employee-form");
const editCloseBtn = document.getElementById("edit-modal-close-btn");
const editCancelBtn = document.getElementById("edit-cancel-btn");
const editIdField = document.getElementById("edit-employee-id");
const editPosition = document.getElementById("edit-position");
const editRole = document.getElementById("edit-role");
const editDepartmentSelect = document.getElementById("edit-department");
const editSalary = document.getElementById("edit-salary");
const editStatus = document.getElementById("edit-status");

let searchDebounce = null;

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = "feedback show " + type;
}

function clearFeedback() {
  feedback.className = "feedback";
  feedback.textContent = "";
}

async function loadDepartmentOptions() {
  try {
    const response = await fetch(`${API_URL}/departments`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) return;

    [departmentFilter, addDepartmentSelect, editDepartmentSelect].forEach((select) => {
      const placeholder = select.querySelector("option").outerHTML;
      select.innerHTML = placeholder;
      data.departments.forEach((dept) => {
        const option = document.createElement("option");
        option.value = dept._id;
        option.textContent = dept.name;
        select.appendChild(option);
      });
    });
  } catch (err) {
    // filters stay with "All Departments" only if this fails
  }
}

function buildQuery() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (departmentFilter.value) params.set("department", departmentFilter.value);
  if (roleFilter.value) params.set("role", roleFilter.value);
  if (statusFilter.value) params.set("status", statusFilter.value);
  return params.toString();
}

async function loadEmployees() {
  showFeedback("Loading employees...", "loading");

  try {
    const query = buildQuery();
    const response = await fetch(`${API_URL}/employees${query ? "?" + query : ""}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.errors?.message || "Could not load employees.", "error");
      return;
    }

    clearFeedback();
    renderTable(data.employees);
  } catch (err) {
    showFeedback("Network error. Is the server running?", "error");
  }
}

function renderTable(employees) {
  tableBody.innerHTML = "";

  if (!employees || employees.length === 0) {
    tableWrapper.hidden = true;
    emptyState.hidden = false;
    return;
  }

  tableWrapper.hidden = false;
  emptyState.hidden = true;

  employees.forEach((emp) => {
    const row = document.createElement("tr");
    const departmentName = emp.department ? emp.department.name : "—";
    const statusClass = emp.employmentStatus === "active" ? "active" : "inactive";
    const toggleLabel = emp.employmentStatus === "active" ? "Deactivate" : "Activate";
    const toggleIcon = emp.employmentStatus === "active" ? "person_remove" : "person_check";

    row.innerHTML = `
      <td>${emp.fname} ${emp.lname}</td>
      <td>${emp.email}</td>
      <td>${emp.position || "—"}</td>
      <td>${departmentName}</td>
      <td>${emp.role}</td>
      <td><span class="status-badge ${statusClass}">${emp.employmentStatus}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn edit-btn" type="button" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn toggle-status-btn" type="button" title="${toggleLabel}">
            <span class="material-symbols-outlined">${toggleIcon}</span>
          </button>
        </div>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => openEditModal(emp));
    row.querySelector(".toggle-status-btn").addEventListener("click", () => toggleStatus(emp));

    tableBody.appendChild(row);
  });
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(loadEmployees, 400);
});

[departmentFilter, roleFilter, statusFilter].forEach((select) => {
  select.addEventListener("change", loadEmployees);
});

function openAddModal() {
  addForm.reset();
  addModal.hidden = false;
}

function closeAddModal() {
  addModal.hidden = true;
}

addBtn.addEventListener("click", openAddModal);
addCloseBtn.addEventListener("click", closeAddModal);
addCancelBtn.addEventListener("click", closeAddModal);

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  document.getElementById("add-email-error").textContent = "";
  document.getElementById("add-password-error").textContent = "";

  const payload = {
    fname: document.getElementById("add-fname").value.trim(),
    lname: document.getElementById("add-lname").value.trim(),
    email: document.getElementById("add-email").value.trim(),
    password: document.getElementById("add-password").value,
    position: document.getElementById("add-position").value.trim(),
    department: addDepartmentSelect.value || null,
    salary: Number(document.getElementById("add-salary").value) || 0,
  };

  try {
    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      if (data.errors?.email) document.getElementById("add-email-error").textContent = data.errors.email;
      if (data.errors?.password) document.getElementById("add-password-error").textContent = data.errors.password;
      if (data.errors?.message) document.getElementById("add-email-error").textContent = data.errors.message;
      return;
    }

    closeAddModal();
    showFeedback("Employee added successfully.", "success");
    loadEmployees();
  } catch (err) {
    document.getElementById("add-email-error").textContent = "Network error. Please try again.";
  }
});

function openEditModal(emp) {
  editForm.reset();
  editIdField.value = emp._id;
  editPosition.value = emp.position || "";
  editRole.value = emp.role;
  editDepartmentSelect.value = emp.department ? emp.department._id : "";
  editSalary.value = emp.salary || 0;
  editStatus.value = emp.employmentStatus;
  editModal.hidden = false;
}

function closeEditModal() {
  editModal.hidden = true;
}

editCloseBtn.addEventListener("click", closeEditModal);
editCancelBtn.addEventListener("click", closeEditModal);

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    position: editPosition.value.trim(),
    role: editRole.value,
    department: editDepartmentSelect.value || null,
    salary: Number(editSalary.value) || 0,
    employmentStatus: editStatus.value,
  };

  try {
    const response = await fetch(`${API_URL}/employees/${editIdField.value}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.errors?.message || "Could not update employee.", "error");
      return;
    }

    closeEditModal();
    showFeedback("Employee updated successfully.", "success");
    loadEmployees();
  } catch (err) {
    showFeedback("Network error. Please try again.", "error");
  }
});

async function toggleStatus(emp) {
  const activating = emp.employmentStatus !== "active";
  const confirmed = window.confirm(
    `${activating ? "Activate" : "Deactivate"} ${emp.fname} ${emp.lname}?`,
  );
  if (!confirmed) return;

  try {
    const response = activating
      ? await fetch(`${API_URL}/employees/${emp._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            position: emp.position,
            role: emp.role,
            department: emp.department ? emp.department._id : null,
            salary: emp.salary,
            employmentStatus: "active",
          }),
        })
      : await fetch(`${API_URL}/employees/${emp._id}/deactivate`, {
          method: "PATCH",
          credentials: "include",
        });

    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.errors?.message || "Could not update status.", "error");
      return;
    }

    showFeedback(`Employee ${activating ? "activated" : "deactivated"} successfully.`, "success");
    loadEmployees();
  } catch (err) {
    showFeedback("Network error. Please try again.", "error");
  }
}

loadDepartmentOptions();
loadEmployees();