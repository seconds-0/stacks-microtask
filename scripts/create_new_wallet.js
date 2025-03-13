/**
 * Script to create a new Stacks wallet for testnet deployment
 */
const { getPublicKey, getStacksAddress, generateWallet, generateNewAccount } = require('@stacks/wallet-sdk');
const { TransactionVersion, getAddressFromPrivateKey } = require('@stacks/transactions');
const fs = require('fs');

// Create a new wallet
async function createWallet() {
  try {
    console.log('Generating new Stacks wallet for testnet...');
    
    // Generate a new wallet with a random key
    const wallet = await generateWallet({
      secretKey: undefined, // Generate a random key
      password: 'password123', // Just for this test wallet
    });
    
    // Get the wallet accounts
    const accounts = wallet.accounts;
    
    if (accounts.length > 0) {
      const firstAccount = accounts[0];
      
      console.log('\n======== NEW WALLET CREATED ========');
      console.log(`Account Name: ${firstAccount.username}`);
      console.log(`Private Key: ${firstAccount.stxPrivateKey}`);
      console.log(`STX Address: ${firstAccount.address}`);
      console.log(`Testnet Address: ${getAddressFromPrivateKey(firstAccount.stxPrivateKey, TransactionVersion.Testnet)}`);
      
      // Save wallet info to file
      const walletInfo = {
        address: getAddressFromPrivateKey(firstAccount.stxPrivateKey, TransactionVersion.Testnet),
        privateKey: firstAccount.stxPrivateKey,
        publicKey: getPublicKey(firstAccount.stxPrivateKey),
        network: 'testnet'
      };
      
      fs.writeFileSync('new-wallet.json', JSON.stringify(walletInfo, null, 2));
      console.log('\nWallet info saved to new-wallet.json');
      
      console.log('\n======== NEXT STEPS ========');
      console.log('1. Request STX from the testnet faucet:');
      console.log('   Visit: https://explorer.stacks.co/sandbox/faucet?chain=testnet');
      console.log('   Enter your testnet address to receive 500 STX');
      console.log('\n2. Use this new account to deploy the contract:');
      console.log('   Update the private key in your deployment script');
      console.log('   Set nonce to 0 for this new account');
      console.log('   Run the deployment script with the new account');
      console.log('===============================');
    } else {
      console.error('No accounts found in generated wallet');
    }
  } catch (error) {
    console.error('Error creating wallet:', error);
  }
}

// Run the function
createWallet().catch(console.error);