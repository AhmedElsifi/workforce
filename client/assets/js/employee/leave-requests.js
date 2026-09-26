import { API_URL } from "../config.js";

const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid"];
const MAX_DURATION_DAYS = 30;
const MAX_REASON_LENGTH = 500;

const form = document.getElementById("leaveForm");
const leaveTypeEl = document.getElementById("leaveType");
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const reasonEl = document.getElementById("reason");

function clearFieldErrors() {
  [leaveTypeEl, startDateEl, endDateEl, reasonEl].forEach((el) =>
    el.setCustomValidity(""),
  );
}

function showFieldError(field, message) {
  field.setCustomValidity(message);
  field.reportValidity();
}

function validateForm() {
  const errors = {};
  const leaveType = leaveTypeEl.value;
  const startDate = startDateEl.value;
  const endDate = endDateEl.value;
  const reason = reasonEl.value.trim();

  if (!leaveType) errors.leaveType = "Leave type is required";
  else if (!LEAVE_TYPES.includes(leaveType)) {
    errors.leaveType = `Leave type must be one of: ${LEAVE_TYPES.join(", ")}`;
  }

  if (!startDate) errors.startDate = "Start date is required";
  if (!endDate) errors.endDate = "End date is required";

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.endDate = "End date must be on or after the start date";
  }

  if (startDate && endDate && !errors.endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const days = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
    if (days > MAX_DURATION_DAYS) {
      errors.endDate = `Leave cannot exceed ${MAX_DURATION_DAYS} days`;
    }
  }

  if (!reason) errors.reason = "Reason is required";
  else if (reason.length > MAX_REASON_LENGTH) {
    errors.reason = `Reason must be at most ${MAX_REASON_LENGTH} characters`;
  }

  return errors;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors();

  const errors = validateForm();
  const firstKey = Object.keys(errors)[0];
  if (firstKey) {
    const fieldMap = {
      leaveType: leaveTypeEl,
      startDate: startDateEl,
      endDate: endDateEl,
      reason: reasonEl,
    };
    showFieldError(fieldMap[firstKey], errors[firstKey]);
    return;
  }

  const body = {
    leaveType: leaveTypeEl.value,
    startDate: startDateEl.value,
    endDate: endDateEl.value,
    reason: reasonEl.value.trim(),
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
      form.reset();
      loadRequests();
    } else {
      const apiErrors = data?.errors || {};
      const firstError = Object.values(apiErrors).find(
        (m) => typeof m === "string",
      );
      alert(firstError || data?.message || "Failed to submit request.");
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