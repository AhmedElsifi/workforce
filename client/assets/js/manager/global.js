import { API_URL } from "../config.js";

export async function getCurrentEmployee() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return await res.json();
}

export function toTitleCase(value) {
  if (!value || typeof value !== "string") return "";

  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getInitials(fname, lname) {
  const first = fname ? fname.charAt(0) : "";
  const last = lname ? lname.charAt(0) : "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "--";
}

export async function loadUserIntoNavbar() {
  try {
    const user = await getCurrentEmployee();

    const fullName =
      `${toTitleCase(user.fname || "")} ${toTitleCase(user.lname || "")}`.trim() ||
      "User";

    const initials = getInitials(user.fname, user.lname);
    const subtitle = user.position || toTitleCase(user.role) || "—";

    const usernameEl =
      document.getElementById("manager-username") ||
      document.getElementById("employee-username");

    const avatarEl =
      document.getElementById("manager-avatar") ||
      document.getElementById("employee-avatar");

    const subtitleEl =
      document.getElementById("manager-department") ||
      document.getElementById("employee-position");

    const usernameMobileEl =
      document.getElementById("manager-username-mobile") ||
      document.getElementById("employee-username-mobile");

    if (usernameEl) usernameEl.textContent = fullName;
    if (avatarEl) avatarEl.textContent = initials;
    if (subtitleEl) subtitleEl.textContent = subtitle;
    if (usernameMobileEl) usernameMobileEl.textContent = fullName;
  } catch (error) {
    console.error("Failed to load user info into navbar:", error);
  }
}

const handleLogout = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "../../index.html";
    } else {
      console.error("Logout failed on server");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

function initNavbar() {
  loadUserIntoNavbar();

  document
    .getElementById("desktop-logout-btn")
    ?.addEventListener("click", handleLogout);

  document
    .getElementById("mobile-logout-btn")
    ?.addEventListener("click", handleLogout);
}

document.addEventListener("DOMContentLoaded", initNavbar);
