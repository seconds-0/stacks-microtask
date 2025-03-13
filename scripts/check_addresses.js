const bip39 = require('bip39');
const { HDKey } = require('@scure/bip32');
const { bytesToHex } = require('@noble/hashes/utils');
const { getAddressFromPrivateKey, TransactionVersion, AddressVersion } = require('@stacks/transactions');

async function testMoreDerivationPaths(mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  
  // Try many combinations
  const paths = [
    "m/44'/5757'/0'/0/0",
    "m/44'/5757'/0'/0/1",
    "m/44'/5757'/0'/0/2",
    "m/44'/0'/0'/0/0",
    "m/44'/0'/0'/0/1",
    "m/0",
    "m/0/0",
    "m/1",
    "m/2"
  ];
  
  paths.forEach((path, index) => {
    const key = hdkey.derive(path);
    const privKey = bytesToHex(key.privateKey);
    const stxAddress = getAddressFromPrivateKey(
      privKey,
      TransactionVersion.Testnet,
      AddressVersion.MainnetSingleSig
    );
    
    console.log(`Path ${index + 1}: ${path}`);
    console.log(`  Private Key: ${privKey}`);
    console.log(`  Stacks Address: ${stxAddress}`);
    console.log();
  });
}

const mnemonic = "chunk smooth level torch wine gate road problem chief senior chunk split retreat napkin roof bunker saddle scale practice cage autumn avocado virus panic";

testMoreDerivationPaths(mnemonic)
  .catch(err => {
    console.error(err);
  });