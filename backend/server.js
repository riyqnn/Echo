const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const validateHandler = require("./api/captive/validate");
const grantAccessHandler = require("./api/captive/grant-access");
const revokeHandler = require("./api/captive/revoke");
const statusHandler = require("./api/captive/status");

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.post("/api/captive/validate", validateHandler);
app.post("/api/captive/grant-access", grantAccessHandler);
app.post("/api/captive/revoke", revokeHandler);
app.get("/api/captive/status", statusHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});