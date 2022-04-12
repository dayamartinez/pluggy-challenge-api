import { Request, Response } from "express";
import clientSanity from "../../config/dataset.config";
import message from "../../constants/messages";
import querySanity from "../../constants/querySanity";

class averageController {
  static async average(req: Request, res: Response) {
    const { GET_AVERAGE_ERROR } = message.errorMessage;
    try {
      const { QUERY_AVERAGE } = querySanity;
      const resultAverage = await clientSanity.fetch(QUERY_AVERAGE);

      if (!resultAverage?.length) {
        return res.status(200).send({ result: {} });
      }
      return res.status(200).send({ result: resultAverage[0] });
    } catch (error) {
      return res
        .status(400)
        .json({ error, message: GET_AVERAGE_ERROR, result: {} });
    }
  }
}

export default averageController;
