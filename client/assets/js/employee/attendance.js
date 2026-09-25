import { apiRequest, ApiError } from "./api.js";
import "./global.js";

const BUSINESS_TIME_ZONE = "Africa/Cairo";

const EM_DASH = "—";

const elements = {
  todayDate: document.getElementById("today-date"),
  todayCheckIn: document.getElementById("today-check-in"),
  todayCheckOut: document.getElementById("today-check-out"),
  todayStatus: document.getElementById("today-status"),
  todayStatusText: document.getElementById("today-status-text"),
  todayHint: document.getElementById("today-hint"),
  checkInButton: document.getElementById("check-in-button"),
  checkOutButton: document.getElementById("check-out-button"),
  feedback: document.getElementById("attendance-feedback"),
  feedbackIcon: document.getElementById("feedback-icon"),
  feedbackMessage: document.getElementById("feedback-message"),
  loading: document.getElementById("history-loading"),
  error: document.getElementById("history-error"),
  errorTitle: document.getElementById("history-error-title"),
  errorMessage: document.getElementById("history-error-message"),
  retryButton: document.getElementById("history-retry"),
  loginLink: document.getElementById("history-login-link"),
  empty: document.getElementById("history-empty"),
  content: document.getElementById("history-content"),
  rows: document.getElementById("history-rows"),
  count: document.getElementById("history-count"),
};

const ERROR_TITLES = {
  401: "Your session has expired",
  403: "Access denied",
};

const DEFAULT_ERROR_TITLE = "We could not load your attendance history";

let isSubmitting = false;


function getTodayWorkDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


function formatWorkDate(workDate, options) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(workDate ?? "");

  if (!match) {
    return EM_DASH;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString("en-US", options);
}

function formatTime(isoTimestamp) {
  if (!isoTimestamp) {
    return EM_DASH;
  }

  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime())) {
    return EM_DASH;
  }

  return date.toLocaleTimeString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}

function showPanel(panel) {
  elements.loading.hidden = panel !== "loading";
  elements.error.hidden = panel !== "error";
  elements.empty.hidden = panel !== "empty";
  elements.content.hidden = panel !== "content";
}

function setStatusPill(element, textElement, iconName, label, modifier) {
  element.className = `status-pill status-pill--${modifier}`;
  element.querySelector(".material-symbols-outlined").textContent = iconName;
  textElement.textContent = label;
}

function createStatusCell(record) {
  const cell = document.createElement("td");
  cell.dataset.label = "Status";

  const pill = document.createElement("span");
  const isCompleted = Boolean(record.checkOut);

  pill.className = `status-pill status-pill--${
    isCompleted ? "completed" : "open"
  }`;

  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.textContent = isCompleted ? "task_alt" : "pending_actions";
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.textContent = isCompleted ? "Completed" : "Open";

  pill.append(icon, label);
  cell.append(pill);

  return cell;
}

function createCell(label, value, extraClass) {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  cell.textContent = value;

  if (extraClass) {
    cell.className = extraClass;
  }

  return cell;
}

function renderHistoryRows(records) {
  const fragment = document.createDocumentFragment();

  for (const record of records) {
    const row = document.createElement("tr");

    row.append(
      createCell(
        "Date",
        formatWorkDate(record.workDate, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        "cell-date",
      ),
      createCell("Check In", formatTime(record.checkIn)),
      createCell(
        "Check Out",
        formatTime(record.checkOut),
        record.checkOut ? undefined : "cell-muted",
      ),
      createStatusCell(record),
    );

    fragment.append(row);
  }

  elements.rows.replaceChildren(fragment);
  elements.count.textContent =
    records.length === 1 ? "1 record" : `${records.length} records`;
}


function renderTodayState(records) {
  const todayWorkDate = getTodayWorkDate();
  const todayRecord = records.find(
    (record) => record.workDate === todayWorkDate,
  );

  elements.todayDate.textContent = formatWorkDate(todayWorkDate, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  elements.todayCheckIn.textContent = formatTime(todayRecord?.checkIn);
  elements.todayCheckOut.textContent = formatTime(todayRecord?.checkOut);

  const hasCheckedIn = Boolean(todayRecord);
  const hasCheckedOut = Boolean(todayRecord?.checkOut);

  elements.checkInButton.hidden = hasCheckedIn;
  elements.checkOutButton.hidden = !hasCheckedIn || hasCheckedOut;
  elements.todayHint.hidden = !hasCheckedOut;

  if (hasCheckedOut) {
    elements.todayHint.textContent = "Today's attendance is complete.";
    setStatusPill(
      elements.todayStatus,
      elements.todayStatusText,
      "task_alt",
      "Completed",
      "completed",
    );
    return;
  }

  if (hasCheckedIn) {
    setStatusPill(
      elements.todayStatus,
      elements.todayStatusText,
      "pending_actions",
      "Checked in",
      "open",
    );
    return;
  }

  setStatusPill(
    elements.todayStatus,
    elements.todayStatusText,
    "schedule",
    "Not checked in",
    "none",
  );
}

function renderTodayUnavailable() {
  elements.checkInButton.hidden = true;
  elements.checkOutButton.hidden = true;
  elements.todayHint.hidden = true;
  elements.todayCheckIn.textContent = EM_DASH;
  elements.todayCheckOut.textContent = EM_DASH;
  elements.todayDate.textContent = formatWorkDate(getTodayWorkDate(), {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  setStatusPill(
    elements.todayStatus,
    elements.todayStatusText,
    "help",
    "Unavailable",
    "none",
  );
}

function showFeedback(type, message) {
  elements.feedback.className = `feedback feedback--${type}`;
  elements.feedbackIcon.textContent =
    type === "success" ? "check_circle" : "error";
  elements.feedbackIcon.setAttribute("aria-hidden", "true");
  elements.feedbackMessage.textContent = message;
  elements.feedback.hidden = false;
}

function clearFeedback() {
  elements.feedback.hidden = true;
}

function renderError(error) {
  const status = error instanceof ApiError ? error.status : null;

  elements.errorTitle.textContent = ERROR_TITLES[status] ?? DEFAULT_ERROR_TITLE;
  elements.errorMessage.textContent =
    error instanceof ApiError
      ? error.message
      : "Something went wrong. Please try again.";

  elements.retryButton.hidden = status === 401 || status === 403;
  elements.loginLink.hidden = status !== 401;

  renderTodayUnavailable();
  showPanel("error");
}

async function loadHistory({ silent = false } = {}) {
  if (!silent) {
    showPanel("loading");
  }

  try {
    const data = await apiRequest("/attendance/history");
    const records = Array.isArray(data?.attendance) ? data.attendance : [];

    renderTodayState(records);

    if (records.length === 0) {
      elements.count.textContent = "";
      showPanel("empty");
      return;
    }

    renderHistoryRows(records);
    showPanel("content");
  } catch (error) {
    if (!(error instanceof ApiError)) {
      console.error("Unexpected attendance history failure:", error);
    }

    renderError(error);
  }
}

function setButtonPending(button, isPending, pendingLabel, idleLabel) {
  const label = button.querySelector(".btn__label");

  button.disabled = isPending;
  button.setAttribute("aria-busy", String(isPending));
  label.textContent = isPending ? pendingLabel : idleLabel;
}


async function submitAttendanceAction({
  path,
  button,
  pendingLabel,
  idleLabel,
}) {
  if (isSubmitting) {
    return;
  }

  isSubmitting = true;
  clearFeedback();
  setButtonPending(button, true, pendingLabel, idleLabel);

  try {
    const data = await apiRequest(path, { method: "POST" });

    showFeedback("success", data?.message ?? "Attendance recorded.");
    await loadHistory({ silent: true });
  } catch (error) {
    if (!(error instanceof ApiError)) {
      console.error("Unexpected attendance action failure:", error);
    }

    showFeedback(
      "error",
      error instanceof ApiError
        ? error.message
        : "Something went wrong. Please try again.",
    );

    
    if (error instanceof ApiError && error.status === 409) {
      await loadHistory({ silent: true });
    }

    if (error instanceof ApiError && error.isAuthError) {
      renderError(error);
    }
  } finally {
    setButtonPending(button, false, pendingLabel, idleLabel);
    isSubmitting = false;
  }
}

elements.checkInButton.addEventListener("click", () =>
  submitAttendanceAction({
    path: "/attendance/check-in",
    button: elements.checkInButton,
    pendingLabel: "Checking in…",
    idleLabel: "Check In",
  }),
);

elements.checkOutButton.addEventListener("click", () =>
  submitAttendanceAction({
    path: "/attendance/check-out",
    button: elements.checkOutButton,
    pendingLabel: "Checking out…",
    idleLabel: "Check Out",
  }),
);

elements.retryButton.addEventListener("click", () => {
  clearFeedback();
  loadHistory();
});

loadHistory();
