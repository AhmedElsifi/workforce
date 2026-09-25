import { API_URL } from "../config.js";

let currentFilter = "pending";

function getEndpoint() {
  // If you use query params instead of separate routes, change this to:
  // return currentFilter === "pending"
  //   ? `${API_URL}/leave-requests?status=pending`
  //   : `${API_URL}/leave-requests`;

  return currentFilter === "pending"
    ? `${API_URL}/leave-requests/pending`
    : `${API_URL}/leave-requests`;
}

async function updateStatus(id, status) {
  const noteInput = document.getElementById(`note-${id}`);
  const managerComment = noteInput ? noteInput.value : "";

  try {
    const res = await fetch(`${API_URL}/leave-requests/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, managerComment }),
    });

    const data = await res.json();
    alert(data.message || `Request ${status.toLowerCase()} successfully.`);
    loadRequests();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update request status. Please try again.");
  }
}

async function loadRequests() {
  const tbody = document.getElementById("requestsTableBody");
  tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Loading requests...</td></tr>`;

  try {
    const res = await fetch(getEndpoint(), {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch requests");

    const data = await res.json();

    if (data.length === 0) {
      const message =
        currentFilter === "pending"
          ? "No pending leave requests found."
          : "No leave requests found.";
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">${message}</td></tr>`;
      return;
    }

    let rowsHtml = "";

    data.forEach((item) => {
      const name = `${item.employeeId?.fname || ""} ${item.employeeId?.lname || ""}`;
      const empName = name.trim() || "Unknown Employee";
      const initials = empName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const startDate = new Date(item.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const endDate = new Date(item.endDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const durationText =
        startDate === endDate ? startDate : `${startDate} - ${endDate}`;

      const typeClass = item.leaveType
        ? item.leaveType.toLowerCase()
        : "personal";
      const statusClass = item.status ? item.status.toLowerCase() : "pending";
      const isPending = statusClass === "pending";

      const noteCell = isPending
        ? `<input type="text" id="note-${item._id}" class="note-input" placeholder="Add a note...">`
        : `<span class="note-text">${item.managerComment || "—"}</span>`;

      const actionCell = isPending
        ? `<div class="action-buttons">
             <button class="btn-approve" data-id="${item._id}" data-status="Approved">Approve</button>
             <button class="btn-reject" data-id="${item._id}" data-status="Rejected">Reject</button>
           </div>`
        : `<span class="text-muted">Processed</span>`;

      rowsHtml += `
        <tr>
          <td>
            <div class="employee-cell">
              <div class="table-avatar">${initials}</div>
              <span>${empName}</span>
            </div>
          </td>
          <td><span class="leave-type-badge ${typeClass}">${item.leaveType || "Personal"}</span></td>
          <td>${durationText}</td>
          <td>${item.reason || "-"}</td>
          <td><span class="status-badge ${statusClass}">${item.status}</span></td>
          <td>${noteCell}</td>
          <td>${actionCell}</td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  } catch (error) {
    console.error("Error loading requests:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Error loading requests. Please try again later.</td></tr>`;
  }
}

document.getElementById("requestsTableBody").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const status = button.dataset.status;

  if (id && status) {
    updateStatus(id, status);
  }
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    loadRequests();
  });
});

document.addEventListener("DOMContentLoaded", loadRequests);
