const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-change-me";
const ACCESS_TTL = process.env.JWT_EXPIRES || "15m";
const REFRESH_TTL = process.env.REFRESH_EXPIRES || "7d";

const signAccess = (sub) =>
  jwt.sign({ sub }, JWT_SECRET, { algorithm: "HS256", expiresIn: ACCESS_TTL });
const signRefresh = (sub) =>
  jwt.sign({ sub, type: "refresh" }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: REFRESH_TTL,
  });

/**
 * register
 * Controller function to register a user with email and password
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.register = async (req, res) => {
  const { email, password } = req.body || {};

  //If the User inputs an invalid email
  if (!email || !password) {
    return res.status(400).json({ error: "Email or Password is Required" });
  }

  //If Email is Already in use
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2d });
  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  res.json({
    access: signAccess(user.id),
    refresh: signRefresh(user.id),
    user: { id: user.id, email: user.email },
  });
};

/**
 * login
 * Allows the user to login
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await argon2.verify(user.passwordHash, password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  res.json({
    access: signAccess(user.id),
    refresh: signRefresh(user.id),
    user: { id: user.id, email: user.email },
  });
};

exports.refresh = async (req, res) => {
  const { refresh } = req.body || {};
  if (!refresh) return res.status(400).json({ error: "Missing refresh" });
  try {
    const payload = jwt.verify(refresh, JWT_SECRET);
    if (payload.type !== "refresh") throw new Error("bad");
    res.json({ access: signAccess(payload.sub) });
  } catch {
    res.status(401).json({ error: "Invalid/expired refresh" });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId).select("_id email");
  res.json({ user: { id: user.id, email: user.email } });
};
