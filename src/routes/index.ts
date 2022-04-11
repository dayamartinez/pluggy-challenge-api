import { Router } from "express";
import quotes from "./quotes.routes";
import average from "./average.routes";
import slippage from "./slippage.routes";

const router: Router = Router();

router.use("/quotes", quotes);
router.use("/average", average);
router.use("/slippage", slippage);

export default router;
