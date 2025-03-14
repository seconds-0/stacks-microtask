const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

// Create Express app
const app = express();

// Define port (use environment variable PORT if available, or 8080 as default)
const PORT = process.env.PORT || 8080;

// Enable compression for all responses
app.use(compression());

// Add security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://api.testnet.hiro.so', 'https://stacks-node-api.testnet.stacks.co'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"]
      }
    },
    // Enable other helmet protections but disable crossOriginEmbedderPolicy
    // to allow loading resources from external domains like unpkg.com
    crossOriginEmbedderPolicy: false
  })
);

// Enable CORS
app.use(cors());

// Determine the correct directory to serve static files from
const staticDir = path.join(__dirname, process.env.VERCEL ? 'public' : '');

// Log the static directory for debugging
console.log(`Serving static files from: ${staticDir}`);

// Serve static files from the determined directory
app.use(express.static(staticDir));

// Specific route for the stacks-connect.js file to ensure it's found
app.get('/stacks-connect.js', (req, res) => {
  console.log('Direct request for stacks-connect.js');
  res.sendFile(path.join(staticDir, 'stacks-connect.js'));
});

// Serve our custom shim
app.get('/stacks-connect-shim.js', (req, res) => {
  console.log('Direct request for stacks-connect-shim.js');
  res.sendFile(path.join(staticDir, 'stacks-connect-shim.js'));
});

// Serve manifest.json
app.get('/manifest.json', (req, res) => {
  console.log('Direct request for manifest.json');
  res.sendFile(path.join(staticDir, 'manifest.json'));
});

// All other GET requests not handled before will return the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🔥 Stacks Micro-Task Board server running at http://localhost:${PORT}/`);
  console.log(`Open this URL in your browser to use the application`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});