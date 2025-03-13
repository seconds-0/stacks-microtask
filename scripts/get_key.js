const bip39 = require('bip39');
const { mnemonicToSeed } = require('bip39');
const { HDKey } = require('@scure/bip32');
const { bytesToHex } = require('@noble/hashes/utils');

async function getPrivateKeysFromMnemonic(mnemonic) {
  const seed = await mnemonicToSeed(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  
  // Generate first 5 addresses from different derivation paths
  console.log("BIP44 Stacks Path (m/44'/5757'/0'/0/0):");
  let key = hdkey.derive("m/44'/5757'/0'/0/0");
  console.log("Private key:", bytesToHex(key.privateKey));
  
  console.log("\nLegacy Path (m/44'/0'/0'/0/0):");
  key = hdkey.derive("m/44'/0'/0'/0/0");
  console.log("Private key:", bytesToHex(key.privateKey));
  
  console.log("\nAlternative Path (m/44'/5757'/0'/0):");
  key = hdkey.derive("m/44'/5757'/0'/0");
  console.log("Private key:", bytesToHex(key.privateKey));
  
  console.log("\nAlternative Path (m/44'/5757'/0'):");
  key = hdkey.derive("m/44'/5757'/0'");
  console.log("Private key:", bytesToHex(key.privateKey));
  
  console.log("\nSimple Path (m/0):");
  key = hdkey.derive("m/0");
  console.log("Private key:", bytesToHex(key.privateKey));
}

const mnemonic = "chunk smooth level torch wine gate road problem chief senior chunk split retreat napkin roof bunker saddle scale practice cage autumn avocado virus panic";

getPrivateKeysFromMnemonic(mnemonic)
  .catch(err => {
    console.error(err);
  });