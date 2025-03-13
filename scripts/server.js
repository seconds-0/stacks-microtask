const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port to use (use 8000 as default, or from environment variable)
const PORT = process.env.PORT || 8000;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Get the file path from the URL
  let filePath = req.url === '/' ? './index.html' : '.' + req.url;
  
  // Determine the content type based on file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  }[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 - File Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}/`);
  console.log(`Open this URL in your browser to use the Micro-Task Board`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});