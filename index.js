const express = require("express");
const axios = require('axios')

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

app.post("/alarmStatus", async (req, res) => {
  const { status } = req.body;

  try {
    const deviceUrl = "http://YOUR_DEVICE_IP:PORT/trigger";
    await axios.post(deviceUrl, { status });

    res.json({ success: true });
  } catch (error) {
    console.error("Error forwarding to hardware device:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to contact hardware device" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
