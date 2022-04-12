import { Request, Response } from "express";
import clientSanity from "../../config/dataset.config";
import message from "../../constants/messages";
import querySanity from "../../constants/querySanity";

class slippageController {
  static async slippage(req: Request, res: Response) {
    const { DEFAULT_ERROR } = message.errorMessage;
    try {
      const { QUERY_SLIPPAGE } = querySanity;
      const result = await clientSanity.fetch(QUERY_SLIPPAGE);
      return res.status(200).send({ result });
    } catch (error) {
      res.status(400).json({ error, message: DEFAULT_ERROR, result: [] });
    }
  }
}

export default slippageController;
