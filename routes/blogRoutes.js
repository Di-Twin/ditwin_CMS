import express from "express";
import supabase from "../config/supabase.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/blog
 * @desc Get all blog posts
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, image, image_alt, main_tag, date, heading, content, tags, share_links"
    );

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @route GET /api/blog/:id
 * @desc Get a specific blog post
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Blog not found" });
  res.json(data);
});

/**
 * @route POST /api/blog
 * @desc Add a new blog post (Editor & Admin)
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    const { image, image_alt, main_tag, date, heading, content, tags } =
      req.body;
    const share_links = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      instagram: `https://www.instagram.com/yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
    };

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          image,
          image_alt,
          main_tag,
          date,
          heading,
          content,
          tags,
          share_links,
        },
      ]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Blog added successfully!", data });
  }
);

/**
 * @route PUT /api/blog/:id
 * @desc Update a blog post (Editor & Admin)
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "editor"]),
  async (req, res) => {
    const { id } = req.params;
    const { image, image_alt, main_tag, date, heading, content, tags } =
      req.body;
    const share_links = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      instagram: `https://www.instagram.com/yourwebsite.com/blog/${heading.replace(
        / /g,
        "-"
      )}`,
    };

    const { data, error } = await supabase
      .from("blogs")
      .update({
        image,
        image_alt,
        main_tag,
        date,
        heading,
        content,
        tags,
        share_links,
      })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Blog updated successfully!", data });
  }
);

/**
 * @route DELETE /api/blog/:id
 * @desc Delete a blog post (Admin only)
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Blog deleted successfully!", data });
  }
);

export default router;
