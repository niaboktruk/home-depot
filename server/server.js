const express = require("express");
const bodyParser = require("body-parser");
const carRoutes = require("./src/routes/carRoutes");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost"],
  })
);

app.use("/cars", carRoutes);

module.exports = app;
