import { apiRequest } from "./api.js";

let currentEmployeeRequest = null;

export function getCurrentEmployee() {
  currentEmployeeRequest ??= apiRequest("/auth/me");
  return currentEmployeeRequest;
}

export function toTitleCase(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function getEmployeeFullName(employee) {
  const fullName = `${employee?.fname ?? ""} ${employee?.lname ?? ""}`;
  return toTitleCase(fullName);
}

function getEmployeeInitials(employee) {
  const initials = `${employee?.fname?.[0] ?? ""}${employee?.lname?.[0] ?? ""}`;
  return initials.toUpperCase() || "–";
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

async function renderShellIdentity() {
  try {
    const employee = await getCurrentEmployee();
    const fullName = getEmployeeFullName(employee) || "Employee";

    setText("employee-username", fullName);
    setText("employee-position", toTitleCase(employee?.position) || "Employee");
    setText("employee-avatar", getEmployeeInitials(employee));
    setText("employee-username-mobile", fullName);
  } catch {
    // The shell stays on its neutral placeholders; the page-level script owns
    // reporting the failure (session expired, offline, server error).
    setText("employee-username", "Employee");
    setText("employee-position", "—");
  }
}

renderShellIdentity();
