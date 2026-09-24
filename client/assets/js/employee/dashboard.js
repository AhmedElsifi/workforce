import { apiRequest, ApiError } from "./api.js";
import { getCurrentEmployee, getEmployeeFullName } from "./global.js";

const elements = {
  employeeName: document.getElementById("dashboard-employee-name"),
  loading: document.getElementById("dashboard-loading"),
  error: document.getElementById("dashboard-error"),
  errorTitle: document.getElementById("dashboard-error-title"),
  errorMessage: document.getElementById("dashboard-error-message"),
  retryButton: document.getElementById("dashboard-retry"),
  loginLink: document.getElementById("dashboard-login-link"),
  stats: document.getElementById("dashboard-stats"),
  empty: document.getElementById("dashboard-empty"),
  total: document.getElementById("stat-total"),
  completed: document.getElementById("stat-completed"),
  open: document.getElementById("stat-open"),
};

const ERROR_TITLES = {
  401: "Your session has expired",
  403: "Access denied",
};

const DEFAULT_ERROR_TITLE = "We could not load your dashboard";

function showPanel(panel) {
  elements.loading.hidden = panel !== "loading";
  elements.error.hidden = panel !== "error";
  elements.stats.hidden = panel !== "stats";
}

function toCount(value) {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function renderStatistics(statistics) {
  const total = toCount(statistics?.totalAttendanceDays);
  const completed = toCount(statistics?.completedAttendanceDays);
  const open = toCount(statistics?.openAttendanceDays);

  elements.total.textContent = total;
  elements.completed.textContent = completed;
  elements.open.textContent = open;

 
  elements.empty.hidden = total !== 0 || completed !== 0 || open !== 0;
}

function renderError(error) {
  const status = error instanceof ApiError ? error.status : null;

  elements.errorTitle.textContent =
    ERROR_TITLES[status] ?? DEFAULT_ERROR_TITLE;

  elements.errorMessage.textContent =
    error instanceof ApiError
      ? error.message
      : "Something went wrong. Please try again.";

  elements.retryButton.hidden = status === 401 || status === 403;
  elements.loginLink.hidden = status !== 401;

  showPanel("error");
}

async function loadDashboard() {
  showPanel("loading");

  try {
    const data = await apiRequest("/employee/dashboard");

    renderStatistics(data?.statistics);
    showPanel("stats");
  } catch (error) {
    if (!(error instanceof ApiError)) {
      console.error("Unexpected dashboard failure:", error);
    }

    renderError(error);
  }
}

async function renderWelcomeMessage() {
  try {
    const employee = await getCurrentEmployee();
    elements.employeeName.textContent =
      getEmployeeFullName(employee) || "Employee";
  } catch {
    elements.employeeName.textContent = "Employee";
  }
}

elements.retryButton.addEventListener("click", loadDashboard);

renderWelcomeMessage();
loadDashboard();
