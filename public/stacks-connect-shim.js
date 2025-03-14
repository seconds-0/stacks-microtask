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