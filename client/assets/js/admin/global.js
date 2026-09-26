import { API_URL } from "../config.js";
import { installAuthRedirect } from "../auth/session.js";

installAuthRedirect();

export async function getCurrentAdmin() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch current admin");

  return await res.json();
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

export async function loadAdminIntoNavbar() {
  try {
    const admin = await getCurrentAdmin();
    const fullName =
      `${capitalize(admin.fname)} ${capitalize(admin.lname)}`.trim() || "Admin";

    const usernameEl = document.getElementById("admin-username");
    const usernameMobileEl = document.getElementById("admin-username-mobile");
    const avatarEl = document.getElementById("admin-avatar");

    if (usernameEl) usernameEl.textContent = fullName;
    if (usernameMobileEl) usernameMobileEl.textContent = fullName;
    if (avatarEl) avatarEl.textContent = getInitials(admin.fname, admin.lname);
  } catch (error) {
    console.error("Failed to load admin info:", error);
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
  loadAdminIntoNavbar();

  document
    .getElementById("desktop-logout-btn")
    ?.addEventListener("click", handleLogout);

  document
    .getElementById("mobile-logout-btn")
    ?.addEventListener("click", handleLogout);
}

document.addEventListener("DOMContentLoaded", initNavbar);