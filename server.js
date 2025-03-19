const WebSocket = require('ws');

// Create a WebSocket server on port 443 (wss://)
const wss = new WebSocket.Server({ port: 443 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Forward messages from ESP32 to all frontend clients
  ws.on('message', (message) => {
    console.log(`Received from ESP32: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on wss://soil-moisture-backend-hmsr.onrender.com:443');