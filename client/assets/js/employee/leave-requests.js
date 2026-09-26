import { API_URL } from "../config.js";

document.getElementById("leaveForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    leaveType: document.getElementById("leaveType").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    reason: document.getElementById("reason").value,
  };

  try {
    const res = await fetch(`${API_URL}/leave-requests/new-request`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Leave request submitted successfully.");
      document.getElementById("leaveForm").reset();
      loadRequests();
    } else {
      alert(data.message || "Failed to submit request.");
    }
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("An error occurred while submitting your request.");
  }
});

async function loadRequests() {
  const tbody = document.getElementById("requestsTable");

  try {
    const res = await fetch(`${API_URL}/leave-requests/my-requests`, {
      credentials: "include",
      method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch requests");

    const data = await res.json();
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-state">You have no leave history.</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const startDate = new Date(item.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const endDate = new Date(item.endDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const statusClass = item.status ? item.status.toLowerCase() : "pending";

      tbody.innerHTML += `
        <tr>
          <td>${item.leaveType}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>${item.reason || "-"}</td>
          <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error loading requests:", error);
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Error loading your leave history. Please try again later.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadRequests);
