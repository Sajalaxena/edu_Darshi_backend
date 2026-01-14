import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import "./cron/question.cron.js";

import researchNewsRoutes from "./routes/researchNews.routes.js";
import previousPaperRoutes from "./routes/previousPaper.routes.js";
import webinarRoutes from "./routes/webinar.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import questionRoutes from "./routes/question.routes.js";
import "./cron/question.cron.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);


app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Swagger
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.options("*", cors());

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/previous-papers", previousPaperRoutes);
app.use("/api/research-news", researchNewsRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/api/question", questionRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("EduDarshi Backend Running 🚀");
});

export default app;
