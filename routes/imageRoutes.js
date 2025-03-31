import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const bucket = process.env.SUPABASE_BUCKET;

// Configure multer for image uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// **Route to Upload Image**
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  try {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    res.json({ message: "Image uploaded successfully", url: data.publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Route to Get All Images**
router.get("/images", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list();

    if (error) throw error;

    const images = data.map((file) => ({
      name: file.name,
      url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
    }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Route to Delete an Image**
router.delete("/delete/:fileName", async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) throw error;

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
