import { Request, Response } from "express";
import clientSanity from "../../config/dataset.config";
import messages from "../../constants/messages";
import querySanity from "../../constants/querySanity";

class quotesController {
  static async quotes(req: Request, res: Response) {
    const { GET_QUOTES_ERROR } = messages.errorMessage;
    const { QUOTES_QUERY } = querySanity;
    try {
      const result = await clientSanity.fetch(QUOTES_QUERY);
      return res.status(200).send({ result });
    } catch (error) {
      return res
        .status(400)
        .json({ error, message: GET_QUOTES_ERROR, result: [] });
    }
  }
}

export default quotesController;
