import { Request, Response } from "express";

class quotesController {
  static async quotes(req: Request, res: Response) {
    try {
      //get db
      res.status(200).send("should be DB response");
    } catch (error) {
      res.json(error);
    }
  }
}

export default quotesController;
