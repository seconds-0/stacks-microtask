/**
 * Minimal Contract Deployment Script
 * Tests deployment of an extremely simple "Hello World" contract
 */
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const fs = require('fs');

/**
 * Deploy minimal Hello World contract to testnet
 */
async function deployContract() {
  // Configuration
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c';
  const contractName = 'hello-world-c43fe8da'; // Must match name in Clarinet.toml
  const contractPath = './contracts/hello-world-c43fe8da.clar';
  const fee = 200000; // 0.2 STX
  const nonce = 6; // Updated based on latest account check
  
  // Print deployment info
  console.log('======== MINIMAL CONTRACT DEPLOYMENT ========');
  console.log(`Contract name: ${contractName}`);
  console.log(`Description: Basic Hello World contract with only 2 functions`);
  console.log(`Network: testnet`);
  console.log(`Fee: ${fee} microSTX (${fee/1000000} STX)`);
  console.log(`Nonce: ${nonce}`);
  console.log('===========================================\n');

  // Read contract source
  console.log('Reading minimal contract source...');
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  console.log(`Contract loaded: ${codeBody.length} bytes`);
  
  try {
    console.log('Creating deployment transaction...');
    const transaction = await makeContractDeploy({
      contractName,
      codeBody,
      senderKey: privateKey,
      network: 'testnet',
      fee,
      nonce,
      anchorMode: 1, // Any
      postConditionMode: 1, // Allow
    });
    
    console.log('Transaction created, broadcasting to testnet...');
    
    try {
      const broadcastResponse = await broadcastTransaction(transaction, 'testnet');
      console.log('\nBroadcast response:');
      console.log(JSON.stringify(broadcastResponse, null, 2));
      
      if (broadcastResponse.txid) {
        console.log(`\n✅ SUCCESS! Deployment transaction broadcast successfully`);
        console.log(`Transaction ID: ${broadcastResponse.txid}`);
        console.log(`Explorer URL: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
        console.log(`\nAfter the transaction confirms, your contract will be available at:`);
        console.log(`ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.${contractName}`);
        
        console.log(`\nIMPORTANT: Check the transaction status in a few minutes using:`);
        console.log(`node check_deployment_status.js ${broadcastResponse.txid}`);
        
        // Update check_deployment_status.js with this transaction ID
        updateStatusCheck(broadcastResponse.txid);
        
        return broadcastResponse.txid;
      } else {
        console.log(`\n❌ ERROR: No transaction ID in response`);
        return null;
      }
    } catch (broadcastError) {
      console.log('\n❌ BROADCAST ERROR:');
      console.log(broadcastError);
      
      if (broadcastError.message) {
        if (broadcastError.message.includes('ConflictingNonceInMempool')) {
          console.log('\n🔄 NONCE CONFLICT: Your previous transaction is still in the mempool');
          console.log('Wait for that transaction to confirm or get dropped, then try again with an updated nonce');
        } else if (broadcastError.message.includes('NotEnoughFunds')) {
          console.log('\n💰 INSUFFICIENT FUNDS: Your account does not have enough STX');
          console.log('Get more STX from the testnet faucet');
        } else if (broadcastError.message.includes('BadNonce')) {
          console.log('\n🔢 BAD NONCE: The nonce is not correct');
          console.log('Run node check_account.js to get the correct nonce');
          
          if (broadcastError.response && broadcastError.response.data) {
            const data = broadcastError.response.data;
            if (data.reason_data && data.reason_data.expected) {
              console.log(`Expected nonce: ${data.reason_data.expected}`);
            }
          }
        }
      }
      
      return null;
    }
  } catch (error) {
    console.error('\nERROR CREATING TRANSACTION:');
    console.error(error);
    return null;
  }
}

/**
 * Update the check_deployment_status.js file with this transaction ID
 */
function updateStatusCheck(txId) {
  const scriptPath = './check_deployment_status.js';
  let scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Update the default transaction ID
  scriptContent = scriptContent.replace(
    /const TX_ID = process\.argv\[2\] \|\| '.*?';/g,
    `const TX_ID = process.argv[2] || '${txId}';`
  );
  
  // Save updated file
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`\nUpdated status check script with transaction ID: ${txId}`);
}

// Execute deployment
deployContract().catch(err => {
  console.error('UNHANDLED ERROR:', err);
});