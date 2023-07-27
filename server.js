import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import "./config/connectToRedis.js";
import router from "./routes/index.js";
import os from 'os'

const app = express();

dotenv.config();

//Body Parser
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello to Memories API", hostname: os.hostname()});
});
app.use("/api", router);
app.use("/user", router);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("##########################################################");
  console.log("#####               STARTING SERVER                  #####");
  console.log("##########################################################\n");
  console.log(`server running on → PORT ${server.address().port}`.yellow.bold);
});

process.on("uncaughtException", (error) => {
  console.log(`uncaught exception: ${error.message}`.red.bold);
  process.exit(1);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
