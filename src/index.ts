import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";

import routes from "./routes";
import collectInfoController from "./controllers/collectInfo.controller";

dotenv.config();
const app: Application = express();

//initalization
const port = process.env.PORT || 3001;
app.set("port", port);
app.use(cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//starting server
app.listen(app.get("port"), () => {
  console.log(`Server started on port ${port}`);
});

//Routes
app.use("/", routes);

//cron - each 60s
cron.schedule("* * * * *", async () => {
  const cronCall: string | undefined =
    await collectInfoController.collectInformation();
  if (cronCall?.includes("error")) console.log(cronCall);
  else console.log("created or updated successfy");
});

// error handler middleware
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(500).send({
      error: {
        status: 500,
        message: "Internal Server Error",
      },
    });
  }
);
