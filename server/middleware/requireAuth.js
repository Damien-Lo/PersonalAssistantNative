const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "no-jwt-set";

module.exports = function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub; // <-- use this in your controllers
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
