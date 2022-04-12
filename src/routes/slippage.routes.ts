import { Router } from "express";
import slippageController from "../controllers/slippage.controller";

const router: Router = Router();

router.get("/", slippageController.slippage);

export default router;
