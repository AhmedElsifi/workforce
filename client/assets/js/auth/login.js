const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorElement = document.getElementById("login-error");
    errorElement.innerHTML = data.errors.message;
    return;
  }

  if (data.user.role === "admin") {
    window.location.href = "./pages/admin/dashboard.html";
  } else if (data.user.role === "manager") {
    window.location.href = "./pages/manager/dashboard.html";
  } else {
    window.location.href = "./pages/employee/dashboard.html";
  }
});
