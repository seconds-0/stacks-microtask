const fetch = require('node-fetch');

async function requestFromFaucet(address) {
  try {
    console.log(`Requesting STX from faucet for address: ${address}`);
    
    const url = `https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx?address=${address}`;
    const response = await fetch(url, {
      method: 'POST'
    });
    
    const data = await response.json();
    console.log('Response from faucet:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`Faucet request successful! Txid: ${data.txId}`);
      console.log(`Transaction: https://explorer.stacks.co/txid/${data.txId}?chain=testnet`);
    } else {
      console.log('Faucet request failed.');
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Use the address from our first derivation path
const address = process.argv[2] || 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
requestFromFaucet(address);