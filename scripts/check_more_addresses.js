const bip39 = require('bip39');
const { HDKey } = require('@scure/bip32');
const { bytesToHex } = require('@noble/hashes/utils');
const { getAddressFromPrivateKey, TransactionVersion, AddressVersion } = require('@stacks/transactions');

async function testMoreDerivationPaths(mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  
  // Try all combinations of version and format
  const key = hdkey.derive("m/44'/5757'/0'/0/0");
  const privKey = bytesToHex(key.privateKey);
  
  console.log(`Private Key: ${privKey}`);
  
  // Generate addresses with different versions
  console.log("\nMainnet addresses:");
  console.log("  Single Sig (P2PKH): " + getAddressFromPrivateKey(
    privKey, 
    TransactionVersion.Mainnet,
    AddressVersion.MainnetSingleSig
  ));
  
  console.log("  Multi Sig (P2SH): " + getAddressFromPrivateKey(
    privKey, 
    TransactionVersion.Mainnet,
    AddressVersion.MainnetMultiSig
  ));
  
  console.log("\nTestnet addresses:");
  console.log("  Single Sig (P2PKH): " + getAddressFromPrivateKey(
    privKey, 
    TransactionVersion.Testnet,
    AddressVersion.TestnetSingleSig
  ));
  
  console.log("  Multi Sig (P2SH): " + getAddressFromPrivateKey(
    privKey, 
    TransactionVersion.Testnet,
    AddressVersion.TestnetMultiSig
  ));
  
  // Try different hardened and non-hardened paths
  const paths = [
    "m/5757'/0'/0'/0/0",
    "m/5757'/0'/0/0",
    "m/5757'/0/0",
    "m/5757/0/0",
    "m/44'/5757'/0/0/0",
    "m/44'/5757/0/0/0"
  ];
  
  console.log("\nAdditional paths (using Testnet Single Sig format):");
  paths.forEach((path, index) => {
    try {
      const pathKey = hdkey.derive(path);
      const pathPrivKey = bytesToHex(pathKey.privateKey);
      const stxAddress = getAddressFromPrivateKey(
        pathPrivKey,
        TransactionVersion.Testnet,
        AddressVersion.TestnetSingleSig
      );
      
      console.log(`Path: ${path}`);
      console.log(`  Private Key: ${pathPrivKey}`);
      console.log(`  Stacks Address: ${stxAddress}`);
      console.log();
    } catch (e) {
      console.log(`Path: ${path} - Error: ${e.message}`);
      console.log();
    }
  });
}

const mnemonic = "chunk smooth level torch wine gate road problem chief senior chunk split retreat napkin roof bunker saddle scale practice cage autumn avocado virus panic";

testMoreDerivationPaths(mnemonic)
  .catch(err => {
    console.error(err);
  });