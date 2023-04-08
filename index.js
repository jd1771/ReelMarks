import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.listen(3000, () => {
  console.debug("App listening on :3000");
});
