/**
 * Stacks contract deployment script for fixed contract
 * Deploys a Clarity contract to Stacks Testnet with improved parameters
 */
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const fs = require('fs');

/**
 * Deploy fixed contract to testnet
 */
async function deployContract() {
  // Configuration - Updated based on account check
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c';
  const contractName = 'microtasks-v5'; // Using a unique name
  const contractPath = './contracts/microtasks-fixed-v3.clar'; // Using our fixed contract
  const fee = 100000; // 0.1 STX - Higher fee for faster processing
  const nonce = 3; // Current nonce from account check

  // Print deployment info
  console.log('======== DEPLOYMENT CONFIGURATION ========');
  console.log(`Contract name: ${contractName}`);
  console.log(`Contract file: ${contractPath}`);
  console.log(`Network: testnet`);
  console.log(`Fee: ${fee} microSTX (0.1 STX)`);
  console.log(`Nonce: ${nonce}`);
  console.log('=========================================\n');

  // Read contract source
  console.log('Reading contract source...');
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
    
    console.log('Transaction created successfully');
    console.log('Broadcasting transaction to testnet...');
    
    try {
      const broadcastResponse = await broadcastTransaction(transaction, 'testnet');
      console.log('Broadcast response:', JSON.stringify(broadcastResponse, null, 2));
      
      if (broadcastResponse.txid) {
        console.log(`\n✅ SUCCESS! Deployment transaction broadcast successfully`);
        console.log(`Transaction ID: ${broadcastResponse.txid}`);
        console.log(`Explorer URL: https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
        console.log(`Contract URL: https://explorer.stacks.co/address/ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.${contractName}?chain=testnet`);
        
        // Update the index.html with the new contract details
        updateFrontend(contractName);
      } else {
        console.log(`\n❌ ERROR: No transaction ID in response`);
      }
    } catch (broadcastError) {
      console.log('\n❌ BROADCAST ERROR:');
      console.log('Error message:', broadcastError.message);
      
      // Handle different error types
      if (broadcastError.response && broadcastError.response.data) {
        console.log('Error details:', JSON.stringify(broadcastError.response.data, null, 2));
        
        if (broadcastError.response.status === 400) {
          if (broadcastError.response.data.error === 'Transaction rejected') {
            console.log('DIAGNOSIS: Your transaction was rejected by the network');
            
            if (broadcastError.response.data.reason === 'NotEnoughFunds') {
              console.log('ISSUE: Not enough funds to pay the fee');
              console.log('SOLUTION: Add more STX to your wallet or reduce the fee');
            } else if (broadcastError.response.data.reason.includes('Nonce')) {
              console.log('ISSUE: Nonce problem. Your nonce is out of sync');
              console.log('SOLUTION: Check your account using the explorer and update the nonce');
              console.log(`EXPLORER: https://explorer.stacks.co/address/ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A?chain=testnet`);
            } else if (broadcastError.response.data.reason.includes('ContractAlreadyExists')) {
              console.log('ISSUE: A contract with this name already exists');
              console.log('SOLUTION: Try a different contract name');
            } else {
              console.log('UNKNOWN REJECTION REASON. Please check explorer for more details.');
            }
          }
        } else if (broadcastError.response.status === 500) {
          console.log('DIAGNOSIS: Server error on the testnet node');
          console.log('SOLUTION: Wait a few minutes and try again');
        }
      } else {
        console.log('DIAGNOSIS: Network or connection error');
        console.log('SOLUTION: Check your internet connection and try again');
      }
    }
  } catch (error) {
    console.error('ERROR CREATING TRANSACTION:', error);
  }
}

// Helper function to update the frontend with new contract details
function updateFrontend(contractName) {
  const indexPath = './index.html';
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Update contract name and turn off demo mode
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
  console.log(`\nFrontend updated to use contract: ${contractName}`);
  console.log(`Demo mode disabled in index.html`);
}

// Execute deployment
deployContract().catch(err => {
  console.error('UNHANDLED ERROR:', err);
});