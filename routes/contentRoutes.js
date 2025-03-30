import express from "express";
import supabase from "../config/supabase.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/content
 * @desc Get all website content
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("website_content").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @route GET /api/content/:section
 * @desc Get specific section content
 */
router.get("/:section", async (req, res) => {
  const { section } = req.params;
  const { data, error } = await supabase
    .from("website_content")
    .select("*")
    .eq("section", section)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @route PUT /api/content/:section
 * @desc Update a section (Admin only)
 */
router.put("/:section", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  const { section } = req.params;
  const { content } = req.body;

  const { data, error } = await supabase
    .from("website_content")
    .update({ content })
    .eq("section", section)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `${section} updated successfully!`, data });
});

/**
 * @route POST /api/content
 * @desc Add new section (Admin only)
 */
router.post("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  const { section, content } = req.body;

  const { data, error } = await supabase
    .from("website_content")
    .insert([{ section, content }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `${section} added successfully!`, data });
});

export default router;
