import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import researchNewsRoutes from "./routes/researchNews.routes.js";
import previousPaperRoutes from "./routes/previousPaper.routes.js";
import webinarRoutes from "./routes/webinar.routes.js";
import blogRoutes from "./routes/blog.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const swaggerDocument = YAML.load("./swagger/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/blogs", blogRoutes);
app.use("/api/previous-papers", previousPaperRoutes);
app.use("/api/research-news", researchNewsRoutes);
app.use("/api/webinars", webinarRoutes);

app.get("/", (req, res) => {
  res.send("EduDarshi Backend Running 🚀");
});

export default app;
