const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

export const validateCreds = ({ fname, lname, email, password }) => {
  const errors = {};

  if (!isNonEmptyString(fname)) {
    errors.fname = "First name is required";
  } else if (fname.trim().length < MIN_NAME_LENGTH) {
    errors.fname = `First name must be at least ${MIN_NAME_LENGTH} characters`;
  } else if (fname.trim().length > MAX_NAME_LENGTH) {
    errors.fname = `First name must be at most ${MAX_NAME_LENGTH} characters`;
  }

  if (!isNonEmptyString(lname)) {
    errors.lname = "Last name is required";
  } else if (lname.trim().length < MIN_NAME_LENGTH) {
    errors.lname = `Last name must be at least ${MIN_NAME_LENGTH} characters`;
  } else if (lname.trim().length > MAX_NAME_LENGTH) {
    errors.lname = `Last name must be at most ${MAX_NAME_LENGTH} characters`;
  }

  if (!isNonEmptyString(email)) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!isNonEmptyString(email)) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateRegister = ({ fname, lname, email, password }) =>
  validateCreds({ fname, lname, email, password });


const validateBaseProfileUpdate = (body) => {
  const errors = {};

  if (body.fname !== undefined) {
    if (!isNonEmptyString(body.fname)) {
      errors.fname = "First name cannot be empty";
    } else if (body.fname.trim().length < MIN_NAME_LENGTH) {
      errors.fname = `First name must be at least ${MIN_NAME_LENGTH} characters`;
    } else if (body.fname.trim().length > MAX_NAME_LENGTH) {
      errors.fname = `First name must be at most ${MAX_NAME_LENGTH} characters`;
    }
  }

  if (body.lname !== undefined) {
    if (!isNonEmptyString(body.lname)) {
      errors.lname = "Last name cannot be empty";
    } else if (body.lname.trim().length < MIN_NAME_LENGTH) {
      errors.lname = `Last name must be at least ${MIN_NAME_LENGTH} characters`;
    } else if (body.lname.trim().length > MAX_NAME_LENGTH) {
      errors.lname = `Last name must be at most ${MAX_NAME_LENGTH} characters`;
    }
  }

  if (body.password !== undefined && body.password !== "") {
    if (typeof body.password !== "string" || body.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
  }

  return errors;
};

export const validateProfileUpdate = (body) => validateBaseProfileUpdate(body);

export const validateProfileUpdateAdmin = (body) => {
  const errors = validateBaseProfileUpdate(body);

  if (body.email !== undefined) {
    if (!isNonEmptyString(body.email)) {
      errors.email = "Email cannot be empty";
    } else if (!EMAIL_REGEX.test(body.email.trim())) {
      errors.email = "Invalid email format";
    }
  }

  if (body.role !== undefined) {
    if (!["admin", "manager", "employee"].includes(body.role)) {
      errors.role = "Role must be admin, manager, or employee";
    }
  }

  if (body.salary !== undefined) {
    const n = Number(body.salary);
    if (!Number.isFinite(n) || n < 0) {
      errors.salary = "Salary must be a non-negative number";
    }
  }

  if (body.employmentStatus !== undefined) {
    if (!["active", "inactive"].includes(body.employmentStatus)) {
      errors.employmentStatus = "Employment status must be active or inactive";
    }
  }

  if (
    body.position !== undefined &&
    body.position !== null &&
    typeof body.position !== "string"
  ) {
    errors.position = "Position must be a string";
  }

  return errors;
};

export { EMAIL_REGEX, MIN_PASSWORD_LENGTH };