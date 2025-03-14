// Stacks Wallet Connect - Using official Leather/Stacks connect library
(function() {
  console.log("🔥 Loading Stacks Wallet Connect Loader");
  
  // Create a loader script that will dynamically inject the official library
  window.loadLeatherConnect = function() {
    return new Promise((resolve, reject) => {
      console.log("Loading official Leather Connect library...");
      
      // Create a script element to load the official connect library
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@leather-wallet/connect@0.4.0/dist/leather-connect.js";
      script.async = true;
      
      script.onload = () => {
        console.log("✓ Official Leather Connect library loaded successfully");
        
        // When loaded, set up our simplified interface
        window.stacksConnect = {
          openConnect: async function(options) {
            console.log("Connecting to wallet with options:", options);
            
            try {
              // Initialize the auth options
              const authOptions = {
                appDetails: {
                  name: options.appName || 'Stacks Micro-Task Board',
                  icon: window.location.origin + '/icon.png'
                },
                redirectTo: '/',
                onFinish: (data) => {
                  console.log("Auth successful:", data);
                  
                  // Create a userSession-like object for compatibility
                  const userSession = {
                    loadUserData: function() {
                      return {
                        profile: {
                          stxAddress: {
                            testnet: data.address,
                          }
                        }
                      };
                    }
                  };
                  
                  if (typeof options.onFinish === 'function') {
                    options.onFinish({ userSession });
                  }
                },
                onCancel: () => {
                  console.log("Auth cancelled");
                  if (options.onCancel) options.onCancel();
                }
              };
              
              // Use the official auth method
              await window.LeatherConnect.auth(authOptions);
              return true;
            } catch (error) {
              console.error("Auth error:", error);
              if (options.onCancel) options.onCancel();
              return false;
            }
          },
          
          openContractCall: async function(options) {
            console.log("Contract call with options:", options);
            
            try {
              // Format the function args to meet the API requirements
              const formattedArgs = options.functionArgs.map(arg => {
                if (typeof arg === 'string') return arg;
                // Handle our encoded types
                if (arg.type === 'string-utf8') {
                  return { type: 'utf8', value: arg.value };
                }
                if (arg.type === 'uint') {
                  return { type: 'uint', value: arg.value };
                }
                return arg;
              });
              
              // Call the official contract-call method
              const txResult = await window.LeatherConnect.contractCall({
                contractAddress: options.contractAddress,
                contractName: options.contractName,
                functionName: options.functionName,
                functionArgs: formattedArgs,
                network: options.network,
                onFinish: (data) => {
                  console.log("Transaction successful:", data);
                  if (options.onFinish) options.onFinish(data);
                },
                onCancel: () => {
                  console.log("Transaction cancelled");
                  if (options.onCancel) options.onCancel();
                }
              });
              
              return txResult;
            } catch (error) {
              console.error("Transaction error:", error);
              return null;
            }
          },
          
          // Data encoding functions
          encodeUtf8: function(value) {
            return { type: "string-utf8", value: value }; 
          },
          
          encodeUint: function(value) {
            return { type: "uint", value: value.toString() };
          }
        };
        
        // Also expose as Connect for compatibility
        window.Connect = window.stacksConnect;
        
        resolve(window.stacksConnect);
      };
      
      script.onerror = (error) => {
        console.error("Failed to load Leather Connect library:", error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  };
  
  // Automatically load the library
  window.loadLeatherConnect().then(() => {
    console.log("Leather Connect interface ready");
  }).catch(error => {
    console.error("Failed to initialize Leather Connect:", error);
  });
  
  console.log("✓ Stacks Wallet Connect Loader initialized");
})();