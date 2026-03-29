import express from "express";
import cors from "cors";

import arcjetMiddleware from "./middlewares/arcject.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import questionPaperRoutes from "./routes/questionPaper.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(arcjetMiddleware);

app.use("/api", questionPaperRoutes);
app.use("/api", feedbackRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
