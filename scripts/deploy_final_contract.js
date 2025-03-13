/**
 * FINAL DEPLOYMENT SCRIPT
 * This script deploys the microtasks contract to Stacks testnet with a higher fee
 * and fixed contract code
 */
const { makeContractDeploy, broadcastTransaction, standardPrincipalCV } = require('@stacks/transactions');
const fs = require('fs');

async function deployContract() {
  // Configuration - UPDATED VALUES
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c'; 
  const contractName = 'microtasks-v6';  // Unique contract name
  const contractPath = './contracts/microtasks-final.clar';  // Using simplified contract
  const fee = 200000;  // 0.2 STX - HIGHER FEE FOR FASTER CONFIRMATION
  const nonce = 4;  // Updated nonce based on error message
  
  console.log('======== FINAL DEPLOYMENT CONFIGURATION ========');
  console.log(`Contract name: ${contractName}`);
  console.log(`Contract file: ${contractPath}`);
  console.log(`Network: testnet`);
  console.log(`Fee: ${fee} microSTX (${fee/1000000} STX)`);
  console.log(`Nonce: ${nonce}`);
  console.log('===============================================\n');

  // Read contract source
  console.log('Reading fixed contract source...');
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  console.log(`Fixed contract loaded: ${codeBody.length} bytes`);
  
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
        
        // Update frontend
        updateFrontend(contractName);
        
        console.log(`\nIMPORTANT: Check the transaction status in a few minutes using:`);
        console.log(`node check_deployment_status.js ${broadcastResponse.txid}`);
      } else {
        console.log(`\n❌ ERROR: No transaction ID in response`);
      }
    } catch (broadcastError) {
      console.log('\n❌ BROADCAST ERROR:');
      console.log(broadcastError);
      
      if (broadcastError.message && broadcastError.message.includes('ConflictingNonceInMempool')) {
        console.log('\n🔄 NONCE CONFLICT: Your previous transaction is still in the mempool');
        console.log('Wait for that transaction to confirm or get dropped, then try again with nonce 2');
      }
    }
  } catch (error) {
    console.error('\nERROR CREATING TRANSACTION:');
    console.error(error);
  }
}

function updateFrontend(contractName) {
  const indexPath = './index.html';
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Update the frontend to use the new contract
  console.log('\nUpdating frontend to use this contract...');
  
  // Set demo mode off and update contract name
  indexContent = indexContent.replace(
    /const DEMO_MODE = true;/g,
    'const DEMO_MODE = false;'
  );
  
  indexContent = indexContent.replace(
    /const contractName = '.*?';/g,
    `const contractName = '${contractName}';`
  );
  
  // Save updated file
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Frontend updated!`);
  console.log(`- Demo mode disabled`);
  console.log(`- Contract name set to: ${contractName}`);
}

// Create a script to check deployment status
function createStatusCheckScript(txId) {
  const scriptPath = './check_deployment_status.js';
  const scriptContent = `/**
 * Script to check contract deployment status
 * Usage: node check_deployment_status.js [txid]
 */
const https = require('https');

// Get transaction ID from command line or use default
const TX_ID = process.argv[2] || '${txId || 'YOUR_TRANSACTION_ID_HERE'}';

// Function to fetch transaction details
function checkDeploymentStatus(txId) {
  // Format the transaction ID correctly
  const formattedTxId = txId.startsWith('0x') ? txId : \`0x\${txId}\`;
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'stacks-node-api.testnet.stacks.co',
      path: \`/extended/v1/tx/\${formattedTxId}\`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const txInfo = JSON.parse(data);
          
          console.log(\`\\n======== DEPLOYMENT STATUS ========\`);
          console.log(\`Transaction: \${formattedTxId}\`);
          console.log(\`Status: \${txInfo.tx_status}\`);
          
          if (txInfo.tx_status === 'success') {
            console.log(\`\\n✅ CONTRACT DEPLOYED SUCCESSFULLY!\`);
            console.log(\`Contract ID: \${txInfo.smart_contract?.contract_id || 'Not available'}\`);
            console.log(\`Contract address: \${txInfo.sender_address}\`);
            console.log(\`\\nYou can now run the app with:\`);
            console.log(\`node server.js\`);
            console.log(\`And navigate to http://localhost:8000 in your browser\`);
          } else if (txInfo.tx_status === 'pending') {
            console.log(\`\\n⏳ DEPLOYMENT STILL PENDING\`);
            console.log(\`Please check again in a few minutes\`);
          } else {
            console.log(\`\\n❌ DEPLOYMENT FAILED\`);
            console.log(\`Reason: \${txInfo.tx_result?.repr || 'Unknown'}\`);
          }
          
          console.log(\`\\nTransaction URL: https://explorer.stacks.co/txid/\${txId}?chain=testnet\`);
          console.log(\`================================\`);
          
          resolve(txInfo);
        } catch (error) {
          reject(new Error(\`Failed to parse transaction data: \${error.message}\`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(\`Error fetching transaction data: \${error.message}\`));
    });

    req.end();
  });
}

// Execute status check
checkDeploymentStatus(TX_ID).catch(error => {
  console.error('Error:', error.message);
});
`;

  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`\nCreated deployment status check script: ${scriptPath}`);
}

// Deploy contract and create status check script
deployContract()
  .then(txId => {
    createStatusCheckScript(txId);
  })
  .catch(err => {
    console.error('UNHANDLED ERROR:', err);
    createStatusCheckScript();
  });