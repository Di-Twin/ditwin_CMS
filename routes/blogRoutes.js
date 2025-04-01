import express from "express";
import supabase from "../config/supabase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
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
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      instagram: `https://www.instagram.com/dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
    };

    const { data, error } = await supabase.from("blogs").insert([
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
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=dtwin.evenbetter.in/blog/${heading.replace(
        / /g,
        "-"
      )}`,
      instagram: `https://www.instagram.com/dtwin.evenbetter.in/blog/${heading.replace(
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

/**
 * @route GET /api/blog/top
 * @desc Get the top 3 recent blog posts, top 3 most used tags, and top 3 most used main tags
 */
router.get("/top", async (req, res) => {
  try {
    // Fetch top 3 recent posts
    const { data: recentPosts, error: recentError } = await supabase
      .from("blogs")
      .select(
        "id, image, image_alt, main_tag, date, heading, content, tags, share_links"
      )
      .order("date", { ascending: false }) // Sort by date in descending order (most recent first)
      .limit(3);

    if (recentError) throw recentError;

    // Fetch all blog posts to calculate top tags & main tags
    const { data: allBlogs, error: tagsError } = await supabase
      .from("blogs")
      .select("main_tag, tags");

    if (tagsError) throw tagsError;

    // Helper function to count occurrences of tags
    const countOccurrences = (arr) => {
      const map = {};
      arr.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((tag) => {
            map[tag] = (map[tag] || 0) + 1;
          });
        } else if (item) {
          map[item] = (map[item] || 0) + 1;
        }
      });
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 3) // Get top 3
        .map(([key]) => key);
    };

    // Get top 3 most used tags
    const allTags = allBlogs.flatMap((blog) => blog.tags || []);
    const topTags = countOccurrences(allTags);

    // Get top 3 most used main tags
    const allMainTags = allBlogs.map((blog) => blog.main_tag);
    const topMainTags = countOccurrences(allMainTags);

    res.json({
      recentPosts,
      topTags,
      topMainTags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
