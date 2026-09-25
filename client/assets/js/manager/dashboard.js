const API_BASE = "http://127.0.0.1:3000";

const usernameField = document.getElementById("manager-username");
const usernameMobileField = document.getElementById("manager-username-mobile");
const departmentField = document.getElementById("manager-department");
const deptSubtitle = document.getElementById("manager-dept-subtitle");
const avatarField = document.getElementById("manager-avatar");

const kpiTotal = document.getElementById("kpi-total");
const kpiActive = document.getElementById("kpi-active");
const kpiInactive = document.getElementById("kpi-inactive");
const kpiPendingLeave = document.getElementById("kpi-pending-leave");

const attendanceRing = document.getElementById("attendance-ring");
const attendanceRateText = document.getElementById("attendance-rate-text");
const attendancePresent = document.getElementById("attendance-present");
const attendanceAbsent = document.getElementById("attendance-absent");

async function loadCurrentManager() {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return;

  const user = await response.json();
  const fullName = `${user.fname ?? ""} ${user.lname ?? ""}`.trim();

  usernameField.textContent = fullName || "Manager";
  usernameMobileField.textContent = fullName || "Manager";
  avatarField.textContent = (user.fname?.[0] ?? "M") + (user.lname?.[0] ?? "");
}

async function loadDashboard() {
  try {
    const response = await fetch(`${API_BASE}/dashboard/manager`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      deptSubtitle.textContent =
        data.message || "Could not load your department dashboard.";
      return;
    }

    departmentField.textContent = data.department.name;
    deptSubtitle.textContent = `Overview of the ${data.department.name} department`;

    kpiTotal.textContent = data.kpis.totalEmployees;
    kpiActive.textContent = data.kpis.activeEmployees;
    kpiInactive.textContent = data.kpis.inactiveEmployees;
    kpiPendingLeave.textContent = data.pendingLeaveRequests;

    const { presentToday, absentToday, clockInRate } = data.attendanceOverview;
    attendanceRing.style.setProperty("--pct", `${clockInRate}%`);
    attendanceRateText.textContent = `${clockInRate}%`;
    attendancePresent.textContent = presentToday;
    attendanceAbsent.textContent = absentToday;
  } catch (error) {
    console.error("Failed to load manager dashboard:", error);
  }
}

loadCurrentManager();
loadDashboard();
