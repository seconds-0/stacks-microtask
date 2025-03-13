const { makeContractDeploy, broadcastTransaction, AnchorMode, PostConditionMode } = require('@stacks/transactions');
const fs = require('fs');

async function deployContract() {
  // Private key for deployment
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c';
  
  // Contract info - We'll use a new name to avoid conflicts with any previous attempts
  const contractName = 'microtasks-v3';
  const contractPath = './contracts/microtasks.clar';
  
  // Read contract source code
  const codeBody = fs.readFileSync(contractPath).toString();
  
  // Prepare contract deploy transaction
  const transaction = await makeContractDeploy({
    contractName,
    codeBody,
    senderKey: privateKey,
    network: 'testnet', // Use testnet
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 50000, // 0.05 STX fee
    nonce: 1    // Important: set the correct nonce
  });
  
  // Broadcast transaction to the network
  console.log('Deploying contract to testnet...');
  
  try {
    const result = await broadcastTransaction(transaction, 'testnet');
    console.log('Deployment result:', result);
    
    if (result.txid) {
      console.log(`\nTransaction ID: ${result.txid}`);
      console.log(`View transaction: https://explorer.stacks.co/txid/${result.txid}?chain=testnet`);
      console.log(`\nAfter the transaction confirms, your contract will be available at:`);
      console.log(`ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.${contractName}`);
      
      // Update the index.html file with the new contract info
      console.log('\nNow updating the frontend with the new contract information...');
      updateFrontend(contractName);
    }
  } catch (error) {
    console.error('Deployment failed:', error);
    
    // If it's a specific type of error with response, try to get more details
    if (error.response && error.response.data) {
      console.error('Error details:', error.response.data);
    }
  }
}

function updateFrontend(contractName) {
  const indexPath = './index.html';
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Update contract name and turn off demo mode
  indexContent = indexContent.replace(
    /const DEMO_MODE = true;/g,
    'const DEMO_MODE = false;'
  );
  
  indexContent = indexContent.replace(
    /const contractName = 'microtasks-v2';/g,
    `const contractName = '${contractName}';`
  );
  
  // Save updated file
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Frontend updated to use contract: ${contractName}`);
}

// Deploy the contract
deployContract().catch(console.error);