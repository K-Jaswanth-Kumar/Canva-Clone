require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 5002;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log(e));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  try {
    app.listen(port, () =>
      console.log(`Upload Service running on port ${port}`)
    );
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
