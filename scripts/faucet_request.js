const https = require('https');

async function requestFromFaucet() {
  const address = 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
  const url = `https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx?address=${address}`;
  
  console.log(`Requesting STX from faucet for address: ${address}`);
  
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('Faucet response:', result);
          
          if (result.success) {
            console.log(`Success! Transaction ID: ${result.txId}`);
            console.log(`Explorer link: https://explorer.stacks.co/txid/${result.txId}?chain=testnet`);
          } else {
            console.log(`Failed: ${result.error}`);
            if (result.error.includes('already funded')) {
              console.log("This address has already been funded recently. The faucet has a cooldown period.");
            }
          }
          
          resolve(result);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Request STX from faucet
requestFromFaucet().catch(console.error);