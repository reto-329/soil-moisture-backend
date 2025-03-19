const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

// Load SSL certificate and key
const server = https.createServer({
  cert: fs.readFileSync('server.crt'), // Path to your SSL certificate
  key: fs.readFileSync('server.key')   // Path to your SSL private key
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from clients (e.g., ESP32)
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all connected clients (e.g., frontend)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the HTTPS server on port 443
server.listen(443, () => {
  console.log('WebSocket server is running on wss://soil-moisture-backend-hmsr.onrender.com:443');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});