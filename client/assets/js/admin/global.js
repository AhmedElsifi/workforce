const adminUsernameField = document.getElementById("admin-username");

async function initAdminDataFields() {
  const response = await fetch("http://127.0.0.1:3000/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const user = await response.json();

  adminUsernameField.innerHTML = user.fname + " " + user.lname;
}

initAdminDataFields();
