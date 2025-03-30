import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Secured: Only Admin Can Add Users
router.post("/add-user", authMiddleware, adminMiddleware, async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (!["admin", "editor", "seo"].includes(role)) {
    return res.status(400).json({ error: "Invalid role!" });
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: "User already exists!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into database
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, role }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "User added successfully!" });
});

// ✅ User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.status(400).json({ error: "User not found!" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid password!" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful!", token, role: user.role });
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password required!" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password in database
  const { error } = await supabase
    .from("users")
    .update({ password: hashedPassword })
    .eq("email", email);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Password reset successful!" });
});

export default router;
