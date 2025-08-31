const http = require('http');

// Simple health check server for deployment platforms
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      discord: 'Capsera AI Bot is running'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🏥 Health check server running on port ${PORT}`);
  console.log(`🔗 Health check available at: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Health check server shutting down...');
  server.close(() => {
    console.log('✅ Health check server closed');
    process.exit(0);
  });
});

module.exports = server;
