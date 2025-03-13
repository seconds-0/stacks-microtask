const https = require('https');

// Function to check contract deployment status
function checkContractStatus(contractAddress, contractName) {
  const url = `https://api.testnet.hiro.so/extended/v1/contract/${contractAddress}.${contractName}`;
  
  console.log(`Checking contract deployment status for ${contractAddress}.${contractName}...`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      // Handle data reception
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // Handle response completion
      response.on('end', () => {
        if (response.statusCode !== 200) {
          console.log(`Error: Status code ${response.statusCode}`);
          console.log(data);
          reject(new Error(`HTTP Status ${response.statusCode}`));
          return;
        }
        
        try {
          const contractInfo = JSON.parse(data);
          console.log('Contract information:');
          console.log(`Status: ${contractInfo.tx_status}`);
          console.log(`Transaction ID: ${contractInfo.tx_id}`);
          console.log(`Block Height: ${contractInfo.block_height}`);
          console.log(`Source code available: ${contractInfo.source_code ? 'Yes' : 'No'}`);
          resolve(contractInfo);
        } catch (error) {
          console.error('Error parsing contract data:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching contract data:', error);
      reject(error);
    });
  });
}

// Run checks for both contracts mentioned in the diagnostic document
async function main() {
  try {
    const contractAddress = 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
    
    console.log("=======================================");
    console.log("Checking minimal-test contract");
    console.log("=======================================");
    await checkContractStatus(contractAddress, 'minimal-test');
    
    console.log("\n=======================================");
    console.log("Checking microtasks-minimal contract");
    console.log("=======================================");
    await checkContractStatus(contractAddress, 'microtasks-minimal');
    
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

main();