const https = require('https');

function checkBalance() {
  const address = 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
  const url = `https://api.testnet.hiro.so/v2/accounts/${address}`;
  
  console.log(`Checking STX balance for address: ${address}`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const accountInfo = JSON.parse(data);
          const balanceSTX = parseInt(accountInfo.balance) / 1000000;
          
          console.log('Account information:');
          console.log(`STX Balance: ${balanceSTX.toFixed(6)} STX`);
          console.log(`Raw Balance: ${accountInfo.balance} microSTX`);
          console.log(`Nonce: ${accountInfo.nonce}`);
          
          if (balanceSTX >= 5) {
            console.log("\n✅ We have enough STX to deploy a contract now!");
            console.log("Run 'node deploy_contract_final.js' to deploy the contract");
          } else {
            console.log("\n⚠️ Balance might not be enough to deploy a contract.");
            console.log("Wait for the faucet transaction to confirm or request more STX.");
          }
          
          resolve(accountInfo);
        } catch (error) {
          console.error('Error parsing account data:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching account data:', error);
      reject(error);
    });
  });
}

// Check balance
checkBalance().catch(console.error);