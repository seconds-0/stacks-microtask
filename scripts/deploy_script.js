const { makeContractDeploy, broadcastTransaction, AnchorMode, PostConditionMode } = require('@stacks/transactions');
const fs = require('fs');
const fetch = require('node-fetch');

async function deployContract() {
  // Private key for deployment
  const privateKey = 'ed491076ac8f2446f5840a241cc16382207e4984b1ac7268ba39e5ff96672a7c';
  
  // Contract info
  const contractName = 'microtasks';
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
    fee: 50000, // Higher fee to ensure processing
    nonce: 0, // Will be automatically detected if this is invalid
  });
  
  // Broadcast transaction to the network
  console.log('Deploying contract to testnet...');
  
  try {
    const result = await broadcastTransaction(transaction, 'testnet');
    console.log('Deployment result:', result);
    
    if (result.txid) {
      console.log(`Transaction ID: ${result.txid}`);
      console.log(`View transaction: https://explorer.stacks.co/txid/${result.txid}?chain=testnet`);
    }
  } catch (error) {
    console.error('Deployment failed:', error);
    
    // If it's a specific type of error with response, try to get more details
    if (error.response) {
      try {
        const errorBody = await error.response.json();
        console.error('Error details:', JSON.stringify(errorBody, null, 2));
      } catch (e) {
        // If we can't parse the response, just show the raw error
        console.error('Raw error response:', error.response);
      }
    }
  }
}

deployContract().catch(console.error);