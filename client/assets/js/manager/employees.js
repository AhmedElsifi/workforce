import { API_URL } from "../config.js";

let allEmployees = [];
let currentFilter = "all";
let searchQuery = "";

async function loadEmployees() {
  const tbody = document.getElementById("employeesTableBody");
  tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Loading employees...</td></tr>`;

  try {
    const res = await fetch(`${API_URL}/employees/department/my-team`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch employees");

    const data = await res.json();
    allEmployees = data.employees || [];
    renderEmployees();
  } catch (error) {
    console.error("Error loading employees:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Error loading employees. Please try again later.</td></tr>`;
  }
}

function getInitials(fname, lname) {
  const first = fname ? fname.charAt(0) : "";
  const last = lname ? lname.charAt(0) : "";
  return `${first}${last}`.toUpperCase() || "--";
}

function formatSalary(salary) {
  return typeof salary === "number"
    ? `$${salary.toLocaleString("en-US")}`
    : "—";
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderEmployees() {
  const tbody = document.getElementById("employeesTableBody");

  const filtered = allEmployees.filter((emp) => {
    const statusMatch =
      currentFilter === "all" || emp.employmentStatus === currentFilter;

    const query = searchQuery.toLowerCase();
    const searchMatch =
      !query ||
      (emp.fname || "").toLowerCase().includes(query) ||
      (emp.lname || "").toLowerCase().includes(query) ||
      (emp.email || "").toLowerCase().includes(query) ||
      (emp.position || "").toLowerCase().includes(query);

    return statusMatch && searchMatch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No employees match your criteria.</td></tr>`;
    return;
  }

  let rowsHtml = "";

  filtered.forEach((emp) => {
    const fullName =
      `${capitalize(emp.fname)} ${capitalize(emp.lname)}`.trim() ||
      "Unknown Employee";
    const initials = getInitials(emp.fname, emp.lname);
    const statusClass = emp.employmentStatus || "inactive";
    const isActive = statusClass === "active";

    const toggleLabel = isActive ? "Deactivate" : "Activate";
    const toggleClass = isActive ? "deactivate" : "activate";
    const nextStatus = isActive ? "inactive" : "active";

    rowsHtml += `
      <tr>
        <td>
          <div class="employee-cell">
            <div class="table-avatar">${initials}</div>
            <div class="employee-name">
              <span class="name">${fullName}</span>
              <span class="role">${capitalize(emp.role) || "—"}</span>
            </div>
          </div>
        </td>
        <td><span class="email-text">${emp.email || "—"}</span></td>
        <td>${emp.position || "—"}</td>
        <td><span class="salary-text">${formatSalary(emp.salary)}</span></td>
        <td><span class="status-badge ${statusClass}">${statusClass}</span></td>
        <td>
          <button
            class="btn-toggle ${toggleClass}"
            data-id="${emp._id}"
            data-status="${nextStatus}"
          >
            ${toggleLabel}
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;
}

async function toggleStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_URL}/employees/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employmentStatus: newStatus }),
    });

    const data = await res.json();

    if (res.ok) {
      const employee = allEmployees.find((e) => e._id === id);
      if (employee) employee.employmentStatus = newStatus;
      renderEmployees();
    } else {
      alert(data.message || "Failed to update employee status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("An error occurred while updating the employee status.");
  }
}

document.getElementById("employeesTableBody").addEventListener("click", (e) => {
  const button = e.target.closest(".btn-toggle");
  if (!button) return;

  const id = button.dataset.id;
  const status = button.dataset.status;

  if (id && status) {
    toggleStatus(id, status);
  }
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    renderEmployees();
  });
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderEmployees();
});

document.addEventListener("DOMContentLoaded", loadEmployees);
