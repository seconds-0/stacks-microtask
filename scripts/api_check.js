/**
 * Stacks Testnet API Diagnosis
 * This script checks testnet health and analyzes recent transactions
 */
const https = require('https');

// Replace with your failed transaction ID
const txId = '97760b5983ea0fabdb0de1ae0df06e6461d33ed032a0438dfbc5e43a7a963e7a';

// Function to make API request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function diagnoseTestnet() {
  console.log('======== TESTNET DIAGNOSIS ========');
  
  // 1. Check testnet info
  try {
    console.log('Checking testnet node info...');
    const info = await makeRequest('https://stacks-node-api.testnet.stacks.co/v2/info');
    console.log('Testnet node info:', JSON.stringify(info, null, 2));
    console.log(`Peer count: ${info.peer_count}`);
    console.log(`Stacks tip height: ${info.stacks_tip_height}`);
    console.log(`Stable block height: ${info.stable_block_height}`);
  } catch (error) {
    console.error('Error getting testnet info:', error.message);
  }
  
  // 2. Check transaction details
  try {
    console.log('\nChecking transaction details...');
    const txDetails = await makeRequest(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${txId}`);
    console.log('Transaction status:', txDetails.tx_status);
    console.log('Raw result:', txDetails.tx_result?.repr || 'None');
    
    // Check internal error codes
    if (txDetails.tx_result && txDetails.tx_result.raw_value) {
      console.log('Raw value:', txDetails.tx_result.raw_value);
    }
  } catch (error) {
    console.error('Error getting transaction details:', error.message);
  }
  
  // 3. Check recently successful contract deployments
  try {
    console.log('\nChecking recent successful contract deployments...');
    const recentTxs = await makeRequest('https://stacks-node-api.testnet.stacks.co/extended/v1/tx/recent?limit=20');
    
    const successfulDeployments = recentTxs.results?.filter(tx => 
      tx.tx_type === 'smart_contract' && tx.tx_status === 'success'
    );
    
    if (successfulDeployments && successfulDeployments.length > 0) {
      console.log(`Found ${successfulDeployments.length} successful deployments:`);
      successfulDeployments.forEach(tx => {
        console.log(`- ${tx.tx_id} (${new Date(tx.burn_block_time_iso).toLocaleString()})`);
        console.log(`  Contract: ${tx.smart_contract?.contract_id || 'N/A'}`);
      });
      
      // Find the most recent successful deployment
      if (successfulDeployments.length > 0) {
        const latestDeployment = successfulDeployments[0];
        console.log('\nExamining most recent successful deployment:');
        console.log(`TX ID: ${latestDeployment.tx_id}`);
        console.log(`Contract: ${latestDeployment.smart_contract?.contract_id || 'N/A'}`);
        console.log(`Sender address: ${latestDeployment.sender_address}`);
        console.log(`Fee: ${latestDeployment.fee_rate} microSTX`);
        console.log(`Block time: ${new Date(latestDeployment.burn_block_time_iso).toLocaleString()}`);
        console.log(`Explorer URL: https://explorer.stacks.co/txid/${latestDeployment.tx_id}?chain=testnet`);
      }
    } else {
      console.log('No successful deployments found in recent transactions');
      console.log('This suggests there might be network-wide issues with the testnet');
    }
  } catch (error) {
    console.error('Error getting recent transactions:', error.message);
  }
  
  console.log('\n======== DIAGNOSIS SUMMARY ========');
  console.log('1. Check if there are ANY successful deployments in the past 24 hours');
  console.log('2. Verify if your transaction was broadcast on a different testnet node');
  console.log('3. Compare your contract with recently deployed successful contracts');
  console.log('4. Review the Stacks blockchain state - check for chain halts or restarts');
  console.log('======================================');
}

diagnoseTestnet();