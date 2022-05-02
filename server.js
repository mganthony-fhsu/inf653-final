require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbCon");

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);



// third party middleware
// Cross Origin Resource Sharing
app.use(cors());
// built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/states", require("./routes/api/states"));



// default
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

// handle error
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});