import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchNewsRoutes from "./routes/researchNews.routes.js";
import previousPaperRoutes from "./routes/previousPaper.routes.js";
import webinarRoutes from "./routes/webinar.routes.js";
dotenv.config();

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// handle preflight
app.options("*", cors());app.use(express.json());

app.use("/api/previous-papers", previousPaperRoutes);
app.use("/api", researchNewsRoutes);
app.use("/api/webinars", webinarRoutes);


app.get("/", (req, res) => {
  res.send("EduDarshi Backend Running 🚀");
});

export default app;
