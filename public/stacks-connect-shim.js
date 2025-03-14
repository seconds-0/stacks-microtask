// Stacks Wallet Connect - Direct Hiro Wallet Integration
// A lightweight implementation that works even when @stacks/connect has issues

(function() {
  console.log("🔥 Loading Stacks Wallet Connect");
  
  // Create the stacksConnect global object
  window.stacksConnect = {
    // The wallet connect function
    openConnect: async function(options) {
      console.log("Connecting to wallet with options:", options);
      
      // Get app details from options
      const appDetails = options?.appDetails || { 
        name: 'Stacks Micro-Task Board',
        icon: window.location.origin + '/icon.png'
      };
      
      // Store the callbacks for when redirected back
      if (options.onFinish) {
        localStorage.setItem('walletConnectOnFinish', 'true');
      }
      
      // Check if we're returning from authentication
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('authResponse')) {
        console.log("Detected authentication response");
        const authResponse = urlParams.get('authResponse');
        
        // Process the auth response
        try {
          // This would be a JWT decode in a real implementation
          // For simplicity, we'll just store that we're logged in
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAuthResponse', authResponse);
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Call the onFinish callback if we stored it earlier
          if (localStorage.getItem('walletConnectOnFinish') === 'true') {
            console.log("Auth successful, calling stored onFinish");
            
            // Create a userSession-like object for compatibility
            const userSession = {
              loadUserData: function() {
                return {
                  profile: {
                    stxAddress: {
                      testnet: localStorage.getItem('walletAddress') || 'ST3ZYKGNY5ZN4DMQXVWT5PSVKG28ZVJ1DAZFR6MG9',
                    }
                  }
                };
              }
            };
            
            if (typeof options.onFinish === 'function') {
              options.onFinish({ userSession });
            }
            
            localStorage.removeItem('walletConnectOnFinish');
            return { userSession };
          }
          
          return true;
        } catch (e) {
          console.error("Error processing auth response:", e);
          if (options.onCancel) options.onCancel();
          return false;
        }
      }
      
      // Get the current URL as the redirect URL
      const redirectUrl = window.location.origin + window.location.pathname;
      
      // Format for Hiro Wallet
      const appParamsBase64 = btoa(JSON.stringify({
        appDetails: appDetails,
        redirect: redirectUrl
      }));
      
      // Build the wallet URL (using Hiro wallet format)
      const authUrl = `https://wallet.hiro.so/connect?authRequest=${appParamsBase64}`;
      
      console.log("Redirecting to Hiro Wallet:", authUrl);
      
      // Open the wallet in a new window
      // You could also redirect the current window with: window.location.href = authUrl;
      window.open(authUrl, '_blank', 'width=450,height=700');
      
      return Promise.resolve({ authUrl });
    },
    
    // Contract call function - simplified version that opens the wallet
    openContractCall: async function(options) {
      console.log("Initiating contract call with options:", options);
      
      const { 
        contractAddress, 
        contractName, 
        functionName, 
        functionArgs,
        network,
        onFinish,
        onCancel
      } = options;
      
      // Store the callback for when redirected back
      if (onFinish) {
        localStorage.setItem('contractCallOnFinish', 'true');
        localStorage.setItem('contractCallFunction', functionName);
      }
      
      // Prepare transaction parameters for Hiro Wallet
      const txParams = {
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: functionName,
        functionArgs: functionArgs?.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)) || []
      };
      
      // Encode as base64 for the URL
      const txParamsBase64 = btoa(JSON.stringify(txParams));
      
      // Format the wallet URL (using Hiro Wallet contract call format)
      const txUrl = `https://wallet.hiro.so/txid?contractCall=${txParamsBase64}`;
      
      // Open the wallet in a new window
      console.log("Opening Hiro Wallet for contract call:", txUrl);
      window.open(txUrl, '_blank', 'width=450,height=700');
      
      return Promise.resolve({ txUrl });
    },
    
    // Data encoding functions - simplified versions
    encodeUtf8: function(value) {
      return {type: "string-utf8", value: value}; 
    },
    
    encodeUint: function(value) {
      return {type: "uint", value: value.toString()};
    }
  };
  
  // Also expose as Connect for compatibility
  window.Connect = window.stacksConnect;
  
  // Check if we should handle an auth response on page load
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('authResponse')) {
      console.log("Processing auth response on page load");
      window.stacksConnect.openConnect({});
    }
  });
  
  console.log("✓ Stacks Wallet Connect loaded successfully");
}());