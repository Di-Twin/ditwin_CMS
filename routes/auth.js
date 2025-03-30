import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  // Ensure valid role
  if (!["admin", "editor", "seo"].includes(role)) {
    return res.status(400).json({ error: "Invalid role!" });
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: "User already exists!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into Supabase
  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword, role }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "User registered successfully!" });
});

// User Login
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

export default router;
