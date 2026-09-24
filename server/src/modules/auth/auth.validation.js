export const validateCreds = ({ fname, lname, email, password }) => {
  const errors = {};

  // Required fields
  if (!fname || !fname.trim()) {
    errors.fname = "First name is required";
  }

  if (!lname || !lname.trim()) {
    errors.lname = "Last name is required";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  // Password strength
  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  return errors;
};
// addtion
export const validateRegister = ({ fname, lname, email, password }) => {
  return validateCreds({
    fname,
    lname,
    email,
    password,
  });
};