/**
 * Script to check contract deployment status
 * Usage: node check_deployment_status.js [txid]
 */
const https = require('https');

// Get transaction ID from command line or use default
const TX_ID = process.argv[2] || '2490cf91a11de31fd63d8b5c5931c03521b2a38b3243d6b93811f14d6fb1ab43';

// Function to fetch transaction details
function checkDeploymentStatus(txId) {
  // Format the transaction ID correctly
  const formattedTxId = txId.startsWith('0x') ? txId : `0x${txId}`;
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'stacks-node-api.testnet.stacks.co',
      path: `/extended/v1/tx/${formattedTxId}`,
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
          
          console.log(`\n======== DEPLOYMENT STATUS ========`);
          console.log(`Transaction: ${formattedTxId}`);
          console.log(`Status: ${txInfo.tx_status}`);
          
          if (txInfo.tx_status === 'success') {
            console.log(`\n✅ CONTRACT DEPLOYED SUCCESSFULLY!`);
            console.log(`Contract ID: ${txInfo.smart_contract?.contract_id || 'Not available'}`);
            console.log(`Contract address: ${txInfo.sender_address}`);
            console.log(`\nYou can now run the app with:`);
            console.log(`node server.js`);
            console.log(`And navigate to http://localhost:8000 in your browser`);
          } else if (txInfo.tx_status === 'pending') {
            console.log(`\n⏳ DEPLOYMENT STILL PENDING`);
            console.log(`Please check again in a few minutes`);
          } else {
            console.log(`\n❌ DEPLOYMENT FAILED`);
            console.log(`Reason: ${txInfo.tx_result?.repr || 'Unknown'}`);
          }
          
          console.log(`\nTransaction URL: https://explorer.stacks.co/txid/${txId}?chain=testnet`);
          console.log(`================================`);
          
          resolve(txInfo);
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

// Execute status check
checkDeploymentStatus(TX_ID).catch(error => {
  console.error('Error:', error.message);
});
