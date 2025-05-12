// Example using in-memory array
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let requestLog = []; // ✅ Store combined requests

// 👤 React Native app or C client will send this
app.post("/sensorTrigger", (req, res) => {
  const { source, status, time } = req.body;

  requestLog.push({ source, status, time: time || new Date().toISOString() });

  res.json({ success: true });
});

// ✅ React Native app will fetch this to display
app.get("/sensorLog", (req, res) => {
  res.json(requestLog);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
