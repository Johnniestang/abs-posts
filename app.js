const express = require("express");
const apiRoutes = require("./routes/apiRoutes");
const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use("/api", apiRoutes);
app.use("/", (req, res) => res.status(404).send("Page Not found"));

module.exports = app;
