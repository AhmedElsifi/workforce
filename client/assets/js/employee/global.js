const employeeUsernameField = document.getElementById("employee-username");
const employeePositionField = document.getElementById("employee-position");

async function initEmployeeDataFields() {
  const response = await fetch("http://127.0.0.1:3000/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const user = await response.json();

  adminUsernameField.innerHTML = user.fname + " " + user.lname;
  employeePositionField.innerHTML = user.position;
}

initEmployeeDataFields();
