const express = require("express");
const cors = require("cors");
const path = require("node:path");
require("dotenv").config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedWILRoutes = require("./routes/savedWILRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  dotfiles: "deny",
  immutable: true,
  maxAge: "1d",
}));

app.get("/", (req, res) => {
  res.json({
    message: "WIL Connect API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-wils", savedWILRoutes);
app.use("/api/admin", adminRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});