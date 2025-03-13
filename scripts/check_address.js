const https = require('https');

const address = process.argv[2] || 'SP29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E0C7EYV7';

// Function to fetch address data from Hiro API
function fetchAddressData(addr) {
  return new Promise((resolve, reject) => {
    const testnetUrl = `https://api.testnet.hiro.so/v1/addresses/${addr}`;
    
    https.get(testnetUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (err) {
          reject(new Error(`Failed to parse data: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch data: ${err.message}`));
    });
  });
}

async function checkAddress() {
  try {
    console.log(`Checking testnet address: ${address}`);
    const addressData = await fetchAddressData(address);
    
    if (addressData.stx_balance) {
      console.log(`Balance: ${addressData.stx_balance.balance} STX`);
      console.log(`Locked: ${addressData.stx_balance.locked} STX`);
    } else {
      console.log('No balance data found');
    }
    
    console.log('\nFull data:');
    console.log(JSON.stringify(addressData, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

checkAddress();