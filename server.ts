import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Logger } from "tslog";
import Collector from "./src/collector";
import connectDB from "./config/db";
import { ReturnType } from "./src/inerfaces";
import Datamodel from "./models/data";

import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const App = express();
const log: Logger = new Logger({ name: "Server root" });

const PORT: string | number = process.env.PORT || 3001;

App.use(cors());
const httpServer = createServer(App);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  //
});
connectDB().then((data: ReturnType) => {
  const { sucess, message } = data;
  if (sucess) {
    log.info({ source: "Server root", message: message });
    setInterval(() => {
      const collector = new Collector();
      collector.run(io);
    }, 1000 * 60);
  } else {
    log.debug({
      source: "Server root",
      message: "Couldn't connect to db. Connexion failed",
    });
  }
});

App.get("/", async (req: Request, res: Response) => {
  const date = new Date();
  Datamodel.findOne({
    date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
  })
    .then((data) => {
      res.status(200).json(data);
      res.end();
    })
    .catch((err) => {
      log.debug({
        source: "Server root",
        message: "Error while handeling request",
        error: `${err.message}`,
      });
      res.status(500).send({ sucess: false, message: "Server error" });
      res.end();
    });
});

httpServer.listen(PORT, () => {
  log.info(`Server started on ${PORT}`);
});
