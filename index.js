import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { router as todoRouter } from "./routers/todo-router.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/todos", todoRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
