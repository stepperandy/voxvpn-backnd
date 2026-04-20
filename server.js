const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const CONFIG_DIR = path.join(__dirname, "configs");

const servers = [
  {
    id: 1,
    name: "EU - Amsterdam",
    country: "Netherlands",
    city: "Amsterdam",
    ovpnFile: "amsterdam.ovpn",
    status: "online"
  }
];

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VoxVPN Backend is running"
  });
});

app.get("/servers", (req, res) => {
  const safeServers = servers.map(({ ovpnFile, ...rest }) => rest);
  res.json({
    success: true,
    servers: safeServers
  });
});

app.get("/download-config/:id", (req, res) => {
  const serverId = parseInt(req.params.id, 10);
  const server = servers.find(s => s.id === serverId);

  if (!server) {
    return res.status(404).json({
      success: false,
      message: "Server not found"
    });
  }

  const filePath = path.join(CONFIG_DIR, server.ovpnFile);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Config file not found"
    });
  }

  res.download(filePath);
});

app.listen(PORT, () => {
  console.log("VoxVPN backend running on port 3000");
});