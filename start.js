const httpServer = require('http-server');
const fs = require('fs');
const path = require('path');

// Load config
let config;
try {
  const configData = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8');
  config = JSON.parse(configData);
} catch (error) {
  console.error('Error loading config.json:', error);
  process.exit(1);
}

const port = config.port || 8080;

const server = httpServer.createServer({
  root: __dirname,
  cache: -1
});

server.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});

