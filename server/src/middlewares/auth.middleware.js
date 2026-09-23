import jwt from "jsonwebtoken";
import path from "path";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .sendFile(path.join(__dirname, "../client/pages/auth/unauthorized.html"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .sendFile(
          path.join(__dirname, "../client/pages/auth/unauthorized.html"),
        );
    }

    next();
  };
};
