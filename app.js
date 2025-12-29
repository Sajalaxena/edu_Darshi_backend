import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchNewsRoutes from "./routes/researchNews.routes.js";
import previousPaperRoutes from "./routes/previousPaper.routes.js";
import webinarRoutes from "./routes/webinar.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/previous-papers", previousPaperRoutes);
app.use("/api", researchNewsRoutes);
app.use("/api/webinars", webinarRoutes);


app.get("/", (req, res) => {
  res.send("EduDarshi Backend Running 🚀");
});

export default app;
