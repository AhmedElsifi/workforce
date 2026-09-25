const API_URL = "/api/leave-requests";

async function loadPendingRequests() {
  const tbody = document.getElementById("pendingTable");

  try {
    const res = await fetch(`${API_URL}/pending`);
    if (!res.ok) throw new Error("Failed to fetch requests");

    const data = await res.json();
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No pending leave requests found.</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const empName = item.employeeId?.name || "Unknown Employee";
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

      tbody.innerHTML += `
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
          <td>
            <input type="text" id="note-${item._id}" class="note-input" placeholder="Add a note...">
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-approve" onclick="updateStatus('${item._id}', 'Approved')">Approve</button>
              <button class="btn-reject" onclick="updateStatus('${item._id}', 'Rejected')">Reject</button>
            </div>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error loading requests:", error);
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Error loading requests. Please try again later.</td></tr>`;
  }
}

async function updateStatus(id, status) {
  const managerComment = document.getElementById(`note-${id}`).value;

  try {
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, managerComment }),
    });

    const data = await res.json();
    alert(data.message || `Request ${status.toLowerCase()} successfully.`);
    loadPendingRequests();
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Failed to update request status. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", loadPendingRequests);
