require("dotenv").config();
import express from "express";
const app = express();
import logger from "./logger";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const port = process.env.PORT || 8080;

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.send("Hello My First backend project ");
});

app.get("/about", (req, res) => {
  res.status(200).send("About my app");
});
