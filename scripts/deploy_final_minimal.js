/**
 * Final Minimal Test Contract Deployment
 * This deploys an absolutely minimal contract with Epoch 2.0
 */
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const fs = require('fs');

/**
 * Deploy minimal test contract
 */
async function deployContract() {
  // Configuration - UPDATED VALUES
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c';
  const contractName = 'minimal-test'; // Ultra minimal contract
  const contractPath = './contracts/minimal-test.clar';
  const fee = 300000; // 0.3 STX - EXTRA HIGH FEE
  const nonce = 9; // Updated nonce based on account check
  
  // Print deployment info
  console.log('======== FINAL MINIMAL DEPLOYMENT ========');
  console.log(`Contract name: ${contractName}`);
  console.log(`Contract file: ${contractPath}`);
  console.log(`Contract size: ${fs.statSync(contractPath).size} bytes`);
  console.log(`Epoch setting: 2.0 (Matched to current testnet)`);
  console.log(`Network: testnet`);
  console.log(`Fee: ${fee} microSTX (${fee/1000000} STX)`);
  console.log(`Nonce: ${nonce}`);
  console.log('===========================================\n');

  // Read contract source
  console.log('Reading contract source...');
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  console.log(`Contract loaded: ${codeBody.length} bytes`);
  console.log(`Contract contains only ${codeBody.split('\n').length} lines`);
  
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
        
        // Update check_deployment_status.js with this transaction ID
        updateStatusCheck(broadcastResponse.txid);
        
        console.log(`\nIMPORTANT: Check the transaction status in a few minutes using:`);
        console.log(`node check_deployment_status.js`);
        
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
  console.log(`Updated status check script with transaction ID: ${txId}`);
}

// Execute deployment
deployContract().catch(err => {
  console.error('UNHANDLED ERROR:', err);
});