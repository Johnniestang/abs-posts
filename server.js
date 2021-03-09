const express = require("express");
const config = require("config");
const apiRoutes = require("./routes/apiRoutes");
const conn = require("./config/mongooseDB");

const app = express();
const env = config.get("env");

// Get DB connection
conn();

// Middleware
app.use(express.json({ extended: false }));

app.use("/api", apiRoutes);
app.use("/", (req, res) => res.status(404).send("Page Not found"));

console.log(`Starting in ${env} mode`);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
