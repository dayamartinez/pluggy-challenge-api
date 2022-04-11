import express from "express";
import cors from "cors";

const app = express();

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
