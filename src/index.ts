import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

//initalization
const port = process.env.PORT || 3001;
app.set("port", port);
app.use(cors());

//settings

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static

//starting server
app.listen(app.get("port"), () => {
  console.log(`Server started on port ${port}`);
});

//Routes
app.use("/", routes);

// error handler middleware
interface error {
  status: number;
  message: string;
}
app.use((err: error, req: Request, res: Response) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});
