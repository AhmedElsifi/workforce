import { API_URL } from "../config.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("login-error");
  errorElement.textContent = "";

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.errors?.message ||
        data?.message ||
        data?.errors?.email ||
        data?.errors?.password ||
        "Login failed. Please try again.";
      errorElement.textContent = message;
      return;
    }

    if (data.user.role === "admin") {
      window.location.href = "./pages/admin/dashboard.html";
    } else if (data.user.role === "manager") {
      window.location.href = "./pages/manager/dashboard.html";
    } else {
      window.location.href = "./pages/employee/dashboard.html";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorElement.textContent = "Network error. Please try again.";
  }
});