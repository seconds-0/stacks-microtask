#!/bin/bash
# Explicit build script for Vercel

echo "EMERGENCY BUILD SCRIPT V2 - BYPASSING ALL CACHING"
echo "==============================================="

# Make public directory if it doesn't exist
mkdir -p public

# Copy key files
cp index.html public/
cp icon.png public/
cp node_modules/@stacks/connect/dist/umd/index.umd.js public/stacks-connect.js

# Create our wallet connection shim
cat > public/stacks-connect-shim.js << 'EOF'
// Stacks Connect Shim - A minimal reimplementation of the critical APIs
// for wallet connection, to work around Vercel deployment issues

(function() {
  console.log("🔥 Loading Stacks Connect Shim");
  
  // Create the stacksConnect global object
  window.stacksConnect = {
    // The wallet connect function
    openConnect: async function(options) {
      console.log("Opening connect with options:", options);
      
      // Redirect to wallet auth page with the needed parameters
      const appDetails = options.appDetails || { name: 'Stacks Micro-Task Board' };
      const redirectUrl = window.location.origin;
      const manifestUrl = `${window.location.origin}/manifest.json`;
      
      // Build the authentication request
      const authUrl = `https://wallet.hiro.so/authenticate?appDetails=${encodeURIComponent(JSON.stringify(appDetails))}&redirect=${encodeURIComponent(redirectUrl)}`;
      
      console.log("Redirecting to:", authUrl);
      window.location.href = authUrl;
      
      // This function will redirect, but for API compatibility we return a promise
      return new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    },
    
    // Contract call function
    openContractCall: async function(options) {
      console.log("Opening contract call with options:", options);
      
      const { 
        contractAddress, 
        contractName, 
        functionName, 
        functionArgs,
        network,
        onFinish,
        onCancel
      } = options;
      
      // Format as a stacks transaction URL
      const txUrl = `https://wallet.hiro.so/contract-call?contractAddress=${contractAddress}&contractName=${contractName}&functionName=${functionName}`;
      
      // Redirect to the wallet
      console.log("Redirecting to wallet for contract call:", txUrl);
      window.location.href = txUrl;
      
      return new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    },
    
    // Data encoding functions
    encodeUtf8: function(value) {
      return JSON.stringify({type: "string-utf8", value: value}); 
    },
    
    encodeUint: function(value) {
      return JSON.stringify({type: "uint", value: value.toString()});
    }
  };
  
  // Also expose as Connect for compatibility
  window.Connect = window.stacksConnect;
  
  console.log("✓ Stacks Connect Shim loaded successfully");
}());
EOF

# Create manifest.json
cat > public/manifest.json << 'EOF'
{
  "name": "Stacks Micro-Task Board",
  "short_name": "Micro-Tasks",
  "description": "Post tasks, earn STX, and build your reputation on the Stacks blockchain.",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#8055ff",
  "background_color": "#1e1e1e"
}
EOF

# Generate a unique timestamp file to force cache invalidation
date > public/build-timestamp-$(date +%s).txt
echo "Current date: $(date)" > public/buildinfo.txt
echo "Cache busting timestamp: $(date +%s)" >> public/buildinfo.txt
echo "Git commit: $(git rev-parse HEAD)" >> public/buildinfo.txt

# Create an emergency fallback route
cat > public/emergency.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Emergency Fallback</title>
  <style>
    body { 
      background-color: red;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
    }
    h1 { font-size: 3em; }
  </style>
</head>
<body>
  <h1>EMERGENCY FALLBACK PAGE</h1>
  <p>This confirms the build script ran: $(date)</p>
  <p>If you're seeing this, the deployment process is working but routing may be broken.</p>
</body>
</html>
EOF

echo "Build script completed successfully with emergency overrides"