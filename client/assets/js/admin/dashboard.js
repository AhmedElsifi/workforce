const API_BASE = "http://127.0.0.1:3000";

const usernameField = document.getElementById("admin-username");
const usernameMobileField = document.getElementById("admin-username-mobile");
const avatarField = document.getElementById("admin-avatar");

const kpiTotal = document.getElementById("kpi-total");
const kpiActive = document.getElementById("kpi-active");
const kpiInactive = document.getElementById("kpi-inactive");
const kpiPendingLeave = document.getElementById("kpi-pending-leave");

const attendanceRing = document.getElementById("attendance-ring");
const attendanceRateText = document.getElementById("attendance-rate-text");
const attendancePresent = document.getElementById("attendance-present");
const attendanceAbsent = document.getElementById("attendance-absent");

const deptDistribution = document.getElementById("dept-distribution");
const activityFeed = document.getElementById("activity-feed");

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);

  const ranges = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [label, secondsInRange] of ranges) {
    const value = Math.floor(seconds / secondsInRange);
    if (value >= 1) {
      return `${value} ${label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

async function loadCurrentAdmin() {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return;

  const user = await response.json();
  const fullName = `${user.fname ?? ""} ${user.lname ?? ""}`.trim();

  usernameField.textContent = fullName || "Admin";
  usernameMobileField.textContent = fullName || "Admin";
  avatarField.textContent = (user.fname?.[0] ?? "A") + (user.lname?.[0] ?? "");
}

function renderKpis(kpis, pendingLeaveRequests) {
  kpiTotal.textContent = kpis.totalEmployees;
  kpiActive.textContent = kpis.activeEmployees;
  kpiInactive.textContent = kpis.inactiveEmployees;
  kpiPendingLeave.textContent = pendingLeaveRequests;
}

function renderAttendance(attendanceOverview) {
  const { presentToday, absentToday, clockInRate } = attendanceOverview;

  attendanceRing.style.setProperty("--pct", `${clockInRate}%`);
  attendanceRateText.textContent = `${clockInRate}%`;
  attendancePresent.textContent = presentToday;
  attendanceAbsent.textContent = absentToday;
}

function renderDepartments(departments) {
  if (!departments.length) {
    deptDistribution.innerHTML =
      '<li class="empty-state">No departments yet.</li>';
    return;
  }

  const maxCount = Math.max(...departments.map((d) => d.employeeCount), 1);

  deptDistribution.innerHTML = departments
    .map(
      (dept) => `
        <li class="dept-row">
          <span class="dept-name">${dept.name}</span>
          <span class="dept-bar-track">
            <span class="dept-bar-fill" style="width:${
              (dept.employeeCount / maxCount) * 100
            }%"></span>
          </span>
          <span class="dept-count">${dept.employeeCount}</span>
        </li>`,
    )
    .join("");
}

function renderActivity(activity) {
  if (!activity.length) {
    activityFeed.innerHTML =
      '<li class="empty-state">No recent activity yet.</li>';
    return;
  }

  activityFeed.innerHTML = activity
    .map(
      (entry) => `
        <li class="activity-item">
          <div class="activity-icon">
            <span class="material-symbols-outlined" style="font-size:16px">history</span>
          </div>
          <div>
            <span class="activity-desc">${entry.description}</span>
            <span class="activity-time">${timeAgo(entry.createdAt)}</span>
          </div>
        </li>`,
    )
    .join("");
}

async function loadDashboard() {
  try {
    const response = await fetch(`${API_BASE}/dashboard/admin`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      deptDistribution.innerHTML =
        '<li class="empty-state">Could not load dashboard data.</li>';
      activityFeed.innerHTML = "";
      return;
    }

    renderKpis(data.kpis, data.pendingLeaveRequests);
    renderAttendance(data.attendanceOverview);
    renderDepartments(data.departmentDistribution);
    renderActivity(data.recentActivity);
  } catch (error) {
    console.error("Failed to load admin dashboard:", error);
  }
}

loadCurrentAdmin();
loadDashboard();
