const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");

const position = document.getElementById("view-position");
const department = document.getElementById("view-department");
const role = document.getElementById("view-role");
const salary = document.getElementById("view-salary");
const statusField = document.getElementById("view-status");

async function initEmployeeDataFields() {
  const response = await fetch("http://127.0.0.1:3000/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const user = await response.json();

  fname.value = user.fname;
  lname.value = user.lname;
  email.value = user.email;

  position.innerHTML = user.position;
  department.innerHTML = user.department;
  role.innerHTML = user.role;
  salary.innerHTML = `$${user.salary}`;
  statusField.innerHTML = user.employmentStatus;
}

initEmployeeDataFields();
