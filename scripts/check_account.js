/**
 * Script to check account details on Stacks Testnet
 * Shows balance, nonce, and transaction history
 */
const https = require('https');

// Account details
const ADDRESS = 'ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A';
const NETWORK = 'testnet';

// Function to fetch account details
function fetchAccountDetails(address) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'stacks-node-api.testnet.stacks.co',
      path: `/v2/accounts/${address}?proof=0`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const accountData = JSON.parse(data);
          resolve(accountData);
        } catch (error) {
          reject(new Error(`Failed to parse account data: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Error fetching account data: ${error.message}`));
    });

    req.end();
  });
}

// Function to fetch transaction history
function fetchTransactionHistory(address) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'stacks-node-api.testnet.stacks.co',
      path: `/extended/v1/address/${address}/transactions?limit=5&offset=0`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const txData = JSON.parse(data);
          resolve(txData);
        } catch (error) {
          reject(new Error(`Failed to parse transaction data: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Error fetching transaction data: ${error.message}`));
    });

    req.end();
  });
}

// Main function
async function main() {
  try {
    console.log(`======== ACCOUNT DETAILS ========`);
    console.log(`Address: ${ADDRESS}`);
    console.log(`Network: ${NETWORK}`);
    console.log(`================================\n`);

    console.log('Fetching account details...');
    const accountData = await fetchAccountDetails(ADDRESS);
    
    // Format STX balance as a readable number
    const balanceSTX = parseInt(accountData.balance) / 1000000;
    
    console.log(`\n======== ACCOUNT INFO ========`);
    console.log(`Balance: ${balanceSTX.toFixed(6)} STX (${accountData.balance} microSTX)`);
    console.log(`Nonce: ${accountData.nonce}`);
    console.log(`==============================\n`);

    console.log('Fetching recent transactions...');
    const txHistory = await fetchTransactionHistory(ADDRESS);
    
    if (txHistory.results && txHistory.results.length > 0) {
      console.log(`\n======== RECENT TRANSACTIONS ========`);
      txHistory.results.forEach((tx, index) => {
        console.log(`\nTransaction ${index + 1}:`);
        console.log(`- TX ID: ${tx.tx_id}`);
        console.log(`- Type: ${tx.tx_type}`);
        console.log(`- Status: ${tx.tx_status}`);
        console.log(`- Timestamp: ${new Date(tx.burn_block_time_iso).toLocaleString()}`);
        console.log(`- Nonce: ${tx.nonce}`);
        console.log(`- Fee: ${tx.fee_rate} microSTX`);
        if (tx.contract_call) {
          console.log(`- Contract: ${tx.contract_call.contract_id}`);
          console.log(`- Function: ${tx.contract_call.function_name}`);
        }
        console.log(`- Explorer: https://explorer.stacks.co/txid/${tx.tx_id}?chain=testnet`);
      });
      console.log(`\n====================================`);
    } else {
      console.log('No transactions found');
    }
    
    console.log(`\n======== DEPLOYMENT RECOMMENDATION ========`);
    console.log(`For your next transaction, use nonce: ${accountData.nonce}`);
    console.log(`Recommended fee: 50000 microSTX (0.05 STX)`);
    console.log(`Use a unique contract name to avoid conflicts`);
    console.log(`=========================================\n`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();