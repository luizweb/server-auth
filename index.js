import express from "express";
import * as dotenv from "dotenv";
import connect from "./config/db.config.js";
import userRoute from "./routes/user.routes.js";
import uploadRoute from "./routes/uploadImage.routes.js";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
connect();

app.use("/user", userRoute);
app.use("/uploadImage", uploadRoute);

app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
