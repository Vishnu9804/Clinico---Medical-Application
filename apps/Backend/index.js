const express = require("express");
const port = 3000;
const port1 = 3001;
const app = express();

require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
