const express = require("express");
const axios = require("axios");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let requestLog = []; // ✅ Store combined requests
let currentAlarmStatus = false;

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

// app.post("/alarmStatus", async (req, res) => {
//   const { status } = req.body;

//   try {
//     const deviceUrl = "http://YOUR_DEVICE_IP:PORT/trigger";
//     await axios.post(deviceUrl, { status });

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Error forwarding to hardware device:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to contact hardware device" });
//   }
// });

app.post("/alarmTrigger", (req, res) => {
  const { status } = req.body;

  if (typeof status !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "Status must be a boolean." });
  }

  currentAlarmStatus = status;
  console.log("Alarm status updated to:", status);

  res.json({ success: true, status: currentAlarmStatus });
});

app.get("/alarmTrigger", (req, res) => {
  res.json({ success: true, status: currentAlarmStatus });
});
