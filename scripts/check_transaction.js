/**
 * Script to check a specific transaction on Stacks Testnet
 * Provides detailed error information for debugging
 */
const https = require('https');

// Transaction details
const TX_ID = '0xbb772b56fd40cc13de0c4180933cd942e01af79b58e1091ed2b534136b6b27ea';
const NETWORK = 'testnet';

// Function to fetch transaction details
function fetchTransactionDetails(txId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'stacks-node-api.testnet.stacks.co',
      path: `/extended/v1/tx/${txId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const txData = JSON.parse(data);
          resolve(txData);
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

// Function to check transaction status
async function main() {
  try {
    console.log(`======== TRANSACTION ANALYSIS ========`);
    console.log(`Transaction ID: ${TX_ID}`);
    console.log(`Network: ${NETWORK}`);
    console.log(`===================================\n`);

    console.log('Fetching transaction details...');
    const txData = await fetchTransactionDetails(TX_ID);

    console.log(`\n======== TRANSACTION DETAILS ========`);
    console.log(`Status: ${txData.tx_status}`);
    console.log(`Type: ${txData.tx_type}`);
    console.log(`Sender address: ${txData.sender_address}`);
    console.log(`Nonce: ${txData.nonce}`);
    console.log(`Fee: ${txData.fee_rate} microSTX`);
    
    if (txData.tx_status === 'abort_by_response') {
      console.log(`\n======== ERROR DETAILS ========`);
      if (txData.tx_result && txData.tx_result.repr) {
        console.log(`Error representation: ${txData.tx_result.repr}`);
      }
      if (txData.events && txData.events.length > 0) {
        console.log('\nEvents:');
        txData.events.forEach((event, index) => {
          console.log(`\nEvent ${index + 1}:`);
          console.log(JSON.stringify(event, null, 2));
        });
      }
    }
    
    // Analyze the rejection reason
    let rejectionReason = '';
    
    if (txData.tx_status === 'abort_by_response') {
      if (txData.tx_result && txData.tx_result.repr) {
        const repr = txData.tx_result.repr;
        
        if (repr.includes('ContractAlreadyExists')) {
          rejectionReason = 'A contract with this name already exists at this address';
        } else if (repr.includes('InsufficientBalance')) {
          rejectionReason = 'Insufficient balance to complete the transaction';
        } else if (repr.includes('syntax error')) {
          rejectionReason = 'Contract has a syntax error';
        } else if (repr.includes('TypeValueError')) {
          rejectionReason = 'Type error in contract code';
        } else {
          rejectionReason = 'Unknown error in contract execution';
        }
      }
    }
    
    console.log(`\n======== DIAGNOSIS ========`);
    console.log(`Transaction status: ${txData.tx_status}`);
    
    if (txData.tx_status === 'abort_by_response') {
      console.log(`Diagnosis: ${rejectionReason || 'Contract execution aborted'}`);
      console.log('\nRecommended actions:');
      console.log('1. Check your contract code for syntax or logical errors');
      console.log('2. Ensure the contract name is unique');
      console.log('3. Verify you have sufficient balance for deployment');
      console.log('4. Try deploying with a higher fee (100,000 microSTX)');
    } else if (txData.tx_status === 'pending') {
      console.log('Diagnosis: Transaction is still pending');
      console.log('Recommended action: Wait for confirmation');
    } else if (txData.tx_status === 'success') {
      console.log('Diagnosis: Transaction was successful');
      console.log(`Contract ID: ${txData.smart_contract?.contract_id || 'N/A'}`);
    } else {
      console.log(`Diagnosis: Transaction failed with status ${txData.tx_status}`);
      console.log('Recommended action: Check the explorer for more details');
    }
    
    console.log('\nExplorer URL:');
    console.log(`https://explorer.stacks.co/txid/${TX_ID.replace('0x', '')}?chain=${NETWORK}`);
    console.log(`===========================\n`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();