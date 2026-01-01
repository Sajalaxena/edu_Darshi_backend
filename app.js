import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import researchNewsRoutes from "./routes/researchNews.routes.js";
import previousPaperRoutes from "./routes/previousPaper.routes.js";
import webinarRoutes from "./routes/webinar.routes.js";

dotenv.config();

const app = express();

/* ---------- CORS ---------- */

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false); // clean block
    },
    credentials: true,
  })
);

/* ---------- MIDDLEWARE ---------- */


const swaggerDocument = YAML.load("./swagger/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

/* ---------- ROUTES ---------- */

app.use("/api/previous-papers", previousPaperRoutes);
app.use("/api", researchNewsRoutes);
app.use("/api/webinars", webinarRoutes);

/* ---------- HEALTH ---------- */

app.get("/", (req, res) => {
  res.send("EduDarshi Backend Running 🚀");
});

export default app;
