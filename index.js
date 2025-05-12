const express = require("express");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const ESP32_CAM_URL = "http://192.168.10.120";

app.use(cors());
app.use(express.json()); // For parsing JSON bodies

app.use(
  "/camera",
  createProxyMiddleware({
    target: ESP32_CAM_URL,
    changeOrigin: true,
  })
);

app.post("/sensorTrigger", (req, res) => {
  const { status } = req.body;
  if (status === "motion") {
    io.emit("alarmTriggered", { message: "🚨 Motion detected!" });
  }
  res.send({ success: true });
});

// Start server
module.exports = app;
