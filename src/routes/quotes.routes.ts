import { Router } from "express";
import quotesController from "../controllers/quotes.controller";

const router: Router = Router();

router.get("/", quotesController.quotes);

export default router;
