const https = require('https');

async function checkTransactionStatus() {
  const txId = 'bb772b56fd40cc13de0c4180933cd942e01af79b58e1091ed2b534136b6b27ea';
  const url = `https://api.testnet.hiro.so/extended/v1/tx/0x${txId}`;
  
  console.log(`Checking deployment status for transaction: ${txId}...`);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          console.log('Transaction status:', parsedData.tx_status);
          
          if (parsedData.tx_status === 'pending') {
            console.log('The deployment is still pending. Check back in a minute or two.');
          } else if (parsedData.tx_status === 'success') {
            console.log('🎉 Contract deployment successful!');
            console.log(`Contract is now available at: ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.microtasks-v3`);
            console.log('\nYou can now use the app with your deployed contract:');
            console.log('1. Run: python -m http.server 8000');
            console.log('2. Open: http://localhost:8000 in your browser');
          } else {
            console.log(`Deployment failed with status: ${parsedData.tx_status}`);
            console.log('Check the explorer for more details:');
            console.log(`https://explorer.stacks.co/txid/0x${txId}?chain=testnet`);
          }
          
          resolve(parsedData);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('Error checking transaction:', error);
      reject(error);
    });
  });
}

checkTransactionStatus().catch(console.error);