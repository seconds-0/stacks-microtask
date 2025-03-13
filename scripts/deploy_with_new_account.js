/**
 * Deploy contract with new Stacks account
 * This script uses a newly created account that received STX from the testnet faucet
 */
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const fs = require('fs');

/**
 * Deploy hello world contract with new account
 */
async function deployContract() {
  // Load wallet info from file
  let walletInfo;
  try {
    walletInfo = JSON.parse(fs.readFileSync('new-wallet.json', 'utf8'));
    console.log(`Using wallet: ${walletInfo.address}`);
  } catch (error) {
    console.error('Error loading wallet info:', error.message);
    console.log('Please run create_new_wallet.js first and fund the account via the faucet');
    return;
  }

  // Configuration
  const privateKey = walletInfo.privateKey;
  const contractName = 'hello-world-new'; // Use a different name for this attempt
  const contractPath = './contracts/hello-world-c43fe8da.clar';
  const fee = 200000; // 0.2 STX
  const nonce = 0; // New account should have nonce 0
  
  // Print deployment info
  console.log('\n======== NEW ACCOUNT DEPLOYMENT ========');
  console.log(`Contract name: ${contractName}`);
  console.log(`Contract file: ${contractPath}`);
  console.log(`Account address: ${walletInfo.address}`);
  console.log(`Network: testnet`);
  console.log(`Fee: ${fee} microSTX (${fee/1000000} STX)`);
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
        console.log(`${walletInfo.address}.${contractName}`);
        
        console.log(`\nIMPORTANT: Check the transaction status in a few minutes by visiting:`);
        console.log(`https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
        
        return broadcastResponse.txid;
      } else {
        console.log(`\n❌ ERROR: No transaction ID in response`);
        return null;
      }
    } catch (broadcastError) {
      console.log('\n❌ BROADCAST ERROR:');
      console.log(broadcastError);
      
      if (broadcastError.message) {
        if (broadcastError.message.includes('NotEnoughFunds')) {
          console.log('\n💰 INSUFFICIENT FUNDS: Your account does not have enough STX');
          console.log('Get more STX from the testnet faucet: https://explorer.stacks.co/sandbox/faucet?chain=testnet');
        } else if (broadcastError.message.includes('BadNonce')) {
          console.log('\n🔢 BAD NONCE: The nonce is not correct');
          console.log('This is a new account, nonce should be 0. If not, check your account on the explorer.');
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

// Execute deployment
deployContract().catch(err => {
  console.error('UNHANDLED ERROR:', err);
});