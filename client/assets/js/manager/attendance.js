import { API_URL } from "../config.js";

let attendanceRecords = [];
let searchQuery = "";

function getTodayISO() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const local = new Date(today.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
}

async function loadAttendance() {
  const tbody = document.getElementById("attendanceTableBody");
  tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Loading attendance...</td></tr>`;

  const date = document.getElementById("dateFilter").value;

  try {
    const url = date
      ? `${API_URL}/attendance/department?date=${date}`
      : `${API_URL}/attendance/department`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch attendance");

    const data = await res.json();
    attendanceRecords = data.records || [];
    renderAttendance();
  } catch (error) {
    console.error("Error loading attendance:", error);
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Error loading attendance. Please try again later.</td></tr>`;
  }
}

function getInitials(fname, lname) {
  const first = fname ? fname.charAt(0) : "";
  const last = lname ? lname.charAt(0) : "";
  return `${first}${last}`.toUpperCase() || "--";
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateHours(clockIn, clockOut) {
  if (!clockIn || !clockOut) return null;
  const diffMs = new Date(clockOut) - new Date(clockIn);
  if (diffMs <= 0) return null;
  const hours = diffMs / (1000 * 60 * 60);
  return hours.toFixed(1);
}

function renderAttendance() {
  const tbody = document.getElementById("attendanceTableBody");

  const filtered = attendanceRecords.filter((record) => {
    const emp = record.employee || {};
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    return (
      (emp.fname || "").toLowerCase().includes(query) ||
      (emp.lname || "").toLowerCase().includes(query)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No attendance records found for this date.</td></tr>`;
    return;
  }

  let rowsHtml = "";

  filtered.forEach((record) => {
    const emp = record.employee || {};
    const fullName =
      `${capitalize(emp.fname)} ${capitalize(emp.lname)}`.trim() ||
      "Unknown Employee";
    const initials = getInitials(emp.fname, emp.lname);

    const clockIn = formatTime(record.clockIn);
    const clockOut = formatTime(record.clockOut);
    const hours = calculateHours(record.clockIn, record.clockOut);

    rowsHtml += `
      <tr>
        <td>
          <div class="employee-cell">
            <div class="table-avatar">${initials}</div>
            <div class="employee-name">
              <span class="name">${fullName}</span>
              <span class="role">${capitalize(emp.position) || "—"}</span>
            </div>
          </div>
        </td>
        <td>${formatDate(record.date)}</td>
        <td><span class="time-text ${clockIn ? "" : "muted"}">${clockIn || "—"}</span></td>
        <td><span class="time-text ${clockOut ? "" : "muted"}">${clockOut || "—"}</span></td>
        <td><span class="hours-badge">${hours ? `${hours} hrs` : "—"}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderAttendance();
});

document.getElementById("dateFilter").addEventListener("change", () => {
  loadAttendance();
});

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("dateFilter");
  dateInput.value = getTodayISO();
  loadAttendance();
});
