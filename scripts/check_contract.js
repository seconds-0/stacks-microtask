const https = require('https');

// Function to check contract deployment status
function checkContractStatus() {
  const contractAddress = 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
  const contractName = 'microtasks';
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

// Function to check transaction status
function checkTransactionStatus() {
  const txId = '9256ecc9a1f291672b0b5d501963f51e872545a6312b26adae4460428dbd6df9';
  const url = `https://api.testnet.hiro.so/extended/v1/tx/${txId}`;
  
  console.log(`\nChecking transaction status for ${txId}...`);
  
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
          const txInfo = JSON.parse(data);
          console.log('Transaction information:');
          console.log(`Status: ${txInfo.tx_status}`);
          console.log(`Block Height: ${txInfo.block_height}`);
          console.log(`Transaction Type: ${txInfo.tx_type}`);
          console.log(`Fee: ${txInfo.fee_rate} microSTX`);
          console.log(`Confirmations: ${txInfo.is_unanchored ? 'Unconfirmed' : txInfo.confirmations + ' confirmations'}`);
          resolve(txInfo);
        } catch (error) {
          console.error('Error parsing transaction data:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching transaction data:', error);
      reject(error);
    });
  });
}

// Run both checks
async function main() {
  try {
    await checkContractStatus();
    await checkTransactionStatus();
  } catch (error) {
    console.error('Error in main execution:', error);
  }
}

main();