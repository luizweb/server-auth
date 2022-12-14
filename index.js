import express from "express";
import * as dotenv from "dotenv";
import connect from "./config/db.config.js";
import userRoute from "./routes/user.routes.js";
import uploadRoute from "./routes/uploadImage.routes.js";
import logRoute from "./routes/log.routes.js";

import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL}));
connect();

app.use("/user", userRoute);
app.use("/uploadImage", uploadRoute);
app.use("/log", logRoute);

app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
