import { Router } from "express";
import { predictQuestions } from "../controllers/predict.controller.js";

const router = Router();

router.get("/predict/:courseCode", predictQuestions);

export default router;
