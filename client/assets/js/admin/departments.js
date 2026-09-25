const API_BASE = "http://127.0.0.1:3000";

const tableBody = document.getElementById("departments-table-body");
const emptyState = document.getElementById("departments-empty");
const feedback = document.getElementById("departments-feedback");
const tableWrapper = document.querySelector(".table-wrapper");

const addBtn = document.getElementById("add-department-btn");
const modal = document.getElementById("department-modal");
const modalTitle = document.getElementById("modal-title");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const form = document.getElementById("department-form");

const idField = document.getElementById("department-id");
const nameField = document.getElementById("department-name");
const nameError = document.getElementById("department-name-error");
const descriptionField = document.getElementById("department-description");
const managerField = document.getElementById("department-manager");
const managerError = document.getElementById("department-manager-error");

const deleteModal = document.getElementById("delete-modal");
const deleteModalText = document.getElementById("delete-modal-text");
const deleteCancelBtn = document.getElementById("delete-cancel-btn");
const deleteConfirmBtn = document.getElementById("delete-confirm-btn");

let departmentToDelete = null;

function showFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = "feedback show " + type;
}

function clearFeedback() {
  feedback.className = "feedback";
  feedback.textContent = "";
}

function clearFieldErrors() {
  nameError.textContent = "";
  managerError.textContent = "";
}

async function loadDepartments() {
  showFeedback("Loading departments...", "loading");

  try {
    const response = await fetch(`${API_BASE}/departments`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.errors?.message || "Could not load departments.", "error");
      return;
    }

    clearFeedback();
    renderTable(data.departments);
  } catch (err) {
    showFeedback("Network error. Is the server running?", "error");
  }
}

function renderTable(departments) {
  tableBody.innerHTML = "";

  if (!departments || departments.length === 0) {
    tableWrapper.hidden = true;
    emptyState.hidden = false;
    return;
  }

  tableWrapper.hidden = false;
  emptyState.hidden = true;

  departments.forEach((dept) => {
    const row = document.createElement("tr");
    const managerName = dept.manager
      ? `${dept.manager.fname} ${dept.manager.lname}`
      : "—";

    row.innerHTML = `
      <td>${dept.name}</td>
      <td>${dept.description || "—"}</td>
      <td>${managerName}</td>
      <td><span class="headcount-badge">${dept.headcount}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-btn edit-btn" type="button" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn danger delete-btn" type="button" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => openEditModal(dept));
    row.querySelector(".delete-btn").addEventListener("click", () => openDeleteModal(dept));

    tableBody.appendChild(row);
  });
}

async function loadManagerOptions(selectedManagerId) {
  managerField.innerHTML = '<option value="">No manager assigned</option>';

  try {
    const response = await fetch(`${API_BASE}/employees?role=manager`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) return;

    data.employees.forEach((emp) => {
      const option = document.createElement("option");
      option.value = emp._id;
      option.textContent = `${emp.fname} ${emp.lname}`;
      if (emp._id === selectedManagerId) option.selected = true;
      managerField.appendChild(option);
    });
  } catch (err) {
    // manager list stays optional if this fails
  }
}

function openAddModal() {
  form.reset();
  idField.value = "";
  clearFieldErrors();
  modalTitle.textContent = "Add Department";
  loadManagerOptions(null);
  modal.hidden = false;
}

function openEditModal(dept) {
  form.reset();
  clearFieldErrors();
  idField.value = dept._id;
  nameField.value = dept.name;
  descriptionField.value = dept.description || "";
  modalTitle.textContent = "Edit Department";
  loadManagerOptions(dept.manager ? dept.manager._id : null);
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

addBtn.addEventListener("click", openAddModal);
modalCloseBtn.addEventListener("click", closeModal);
modalCancelBtn.addEventListener("click", closeModal);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors();

  const id = idField.value;
  const payload = {
    name: nameField.value.trim(),
    description: descriptionField.value.trim(),
    manager: managerField.value || null,
  };

  const url = id ? `${API_BASE}/departments/${id}` : `${API_BASE}/departments`;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      if (data.errors?.name) nameError.textContent = data.errors.name;
      if (data.errors?.manager) managerError.textContent = data.errors.manager;
      if (data.errors?.message && !data.errors.name && !data.errors.manager) {
        nameError.textContent = data.errors.message;
      }
      return;
    }

    closeModal();
    showFeedback(
      id ? "Department updated successfully." : "Department created successfully.",
      "success",
    );
    loadDepartments();
  } catch (err) {
    nameError.textContent = "Network error. Please try again.";
  }
});

function openDeleteModal(dept) {
  departmentToDelete = dept;
  deleteModalText.textContent = `Are you sure you want to delete "${dept.name}"? This cannot be undone.`;
  deleteModal.hidden = false;
}

deleteCancelBtn.addEventListener("click", () => {
  deleteModal.hidden = true;
  departmentToDelete = null;
});

deleteConfirmBtn.addEventListener("click", async () => {
  if (!departmentToDelete) return;

  try {
    const response = await fetch(`${API_BASE}/departments/${departmentToDelete._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    deleteModal.hidden = true;

    if (!response.ok) {
      showFeedback(data.errors?.message || "Could not delete department.", "error");
      departmentToDelete = null;
      return;
    }

    showFeedback("Department deleted successfully.", "success");
    departmentToDelete = null;
    loadDepartments();
  } catch (err) {
    deleteModal.hidden = true;
    showFeedback("Network error. Please try again.", "error");
  }
});

loadDepartments();