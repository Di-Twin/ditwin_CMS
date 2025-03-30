import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from './routes/contentRoutes.js'
import blogRoutes from './routes/blogRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("pg_stat_database")
    .select("*")
    .limit(1);

  if (error) {
    return res
      .status(500)
      .json({ message: "Supabase connection failed", error });
  }

  res.json({ message: "Supabase connected successfully!", data });
});

app.use("/auth", authRoutes); // Authentication Routes
app.use("/api/content", contentRoutes); // Website Content
app.use("/api/blogs", blogRoutes); // Website Content

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
