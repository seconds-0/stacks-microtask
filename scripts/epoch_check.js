/**
 * Stacks Testnet Epoch Diagnosis
 * This script checks the current testnet epoch and compares with our contract settings
 */
const https = require('https');

async function makeRequest(url) {
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

async function checkEpochInfo() {
  console.log('======== TESTNET EPOCH INFO ========');
  
  try {
    // Get current network info
    const info = await makeRequest('https://stacks-node-api.testnet.stacks.co/v2/info');
    console.log('Network info:', JSON.stringify(info, null, 2));
    
    // Check current epoch
    if (info.burn_block_height) {
      console.log(`Current burn block height: ${info.burn_block_height}`);
      
      // Stacks epochs and transitions
      const epochs = [
        { name: "Epoch 2.0", start: 0 },
        { name: "Epoch 2.05", start: 666050 },
        { name: "Epoch 2.1", start: 680175 },
        { name: "Epoch 2.2", start: 689780 },
        { name: "Epoch 2.3", start: 751800 },
        { name: "Epoch 2.4", start: 781551 },
        { name: "Epoch 2.5", start: 796075 }
      ];
      
      // Determine current epoch
      let currentEpoch = epochs[0];
      for (const epoch of epochs) {
        if (info.burn_block_height >= epoch.start) {
          currentEpoch = epoch;
        } else {
          break;
        }
      }
      
      console.log(`Current epoch appears to be: ${currentEpoch.name}`);
      console.log(`Your contracts are using: Epoch 2.1 and Epoch 3.0`);
      
      if (currentEpoch.name !== "Epoch 2.1" && currentEpoch.name !== "Epoch 3.0") {
        console.log('\n⚠️ POTENTIAL EPOCH MISMATCH ⚠️');
        console.log(`Your contracts specify epochs (2.1 and 3.0) that may not match the current testnet epoch (${currentEpoch.name})`);
        console.log('Try updating your contract epoch to match the current testnet epoch');
        
        // Provide specific fix instructions
        console.log('\nTo fix this, update your Clarinet.toml file:');
        console.log(`1. Change "epoch = \\"2.1\\"" to "epoch = \\"${currentEpoch.name.toLowerCase()}\\""`);
        console.log(`2. Try deploying again with the updated epoch`);
      } else {
        console.log('\n✅ EPOCH MATCHES');
        console.log('Your contract epoch settings match the current testnet epoch');
      }
    } else {
      console.log('Unable to determine current epoch from API response');
    }
    
    // Check recent successful contract deployments
    console.log('\nChecking recent successful contract deployments...');
    const recentTxs = await makeRequest('https://stacks-node-api.testnet.stacks.co/extended/v1/tx/recent?limit=50');
    
    const successfulDeployments = recentTxs.results?.filter(tx => 
      tx.tx_type === 'smart_contract' && tx.tx_status === 'success'
    );
    
    if (successfulDeployments && successfulDeployments.length > 0) {
      console.log(`Found ${successfulDeployments.length} successful deployments recently`);
      
      // Check actual smart contract code if available
      const latestDeploymentId = successfulDeployments[0].tx_id;
      const deploymentDetails = await makeRequest(`https://stacks-node-api.testnet.stacks.co/extended/v1/tx/${latestDeploymentId}`);
      
      if (deploymentDetails.smart_contract && deploymentDetails.smart_contract.source_code) {
        const sourceCode = deploymentDetails.smart_contract.source_code;
        console.log('\nAnalyzing successful contract source code:');
        
        // Look for patterns that might indicate epoch-specific features
        const epochIndicators = {
          'stx-transfer?': 0,
          'as-contract': 0,
          'let': 0,
          'map-get?': 0,
          'map-set': 0,
          'map-insert': 0,
          'map-delete': 0,
          'contract-call?': 0,
          'print': 0
        };
        
        Object.keys(epochIndicators).forEach(key => {
          const regex = new RegExp(key, 'g');
          const matches = sourceCode.match(regex);
          if (matches) {
            epochIndicators[key] = matches.length;
          }
        });
        
        console.log('Feature usage in successful contract:');
        Object.entries(epochIndicators).forEach(([key, value]) => {
          console.log(`- ${key}: ${value} occurrences`);
        });
        
        // Check if your contracts use similar patterns
        console.log('\nCheck if your contracts use similar patterns');
      }
    } else {
      console.log('No successful deployments found in recent transactions');
      console.log('This suggests there might be network-wide issues with the testnet');
    }
  } catch (error) {
    console.error('Error checking epoch info:', error);
  }
  
  console.log('\n============= CONCLUSION =============');
  console.log('If your epoch settings don\'t match the current testnet epoch,');
  console.log('this could be the root cause of deployment failures.');
  console.log('Update your Clarinet.toml and try again with the correct epoch.');
  console.log('=======================================');
}

checkEpochInfo();