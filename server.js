const express = require("express");
const apiRoutes = require("./routes/apiRoutes");
const app = express();
const conn = require("./config/mongooseDB");

// Get DB connection
conn();

// Middleware
app.use(express.json({ extended: false }));

app.use("/api", apiRoutes);
app.use("/", (req, res) => res.status(404).send("Page Not found"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
