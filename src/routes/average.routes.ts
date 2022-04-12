import { Router } from "express";
import averageController from "../controllers/average.controller";

const router: Router = Router();

router.get("/", averageController.average);

export default router;
