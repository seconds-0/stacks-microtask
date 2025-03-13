# Stacks Explorer Deployment Guide

Since we're having issues deploying contracts through the API, let's try using the Stacks Explorer UI to deploy our minimal contract.

## Prerequisites
- Hiro Wallet browser extension installed and set up with your testnet STX
- Access to a web browser

## Steps to Deploy

1. **Copy the contract code**
   Copy the following contract code:
   ```clarity
   ;; hello-world-c43fe8da.clar
   ;; A minimal hello world contract for testnet deployment testing

   ;; Read-only function that returns a greeting
   (define-read-only (greet)
     (ok "Hello, Stacks World!"))

   ;; Public function that returns a greeting with name
   (define-public (greet-name (name (string-utf8 50)))
     (ok (concat "Hello, " name "!")))
   ```

2. **Open Stacks Explorer Sandbox**
   - Go to https://explorer.stacks.co/sandbox/contract-call?chain=testnet
   - Make sure you're on the "Testnet" network (check the dropdown in the top right)

3. **Connect your wallet**
   - Click "Connect Wallet" in the top right
   - Select your Hiro Wallet with testnet STX

4. **Deploy the contract**
   - Once connected, click on "Write & Deploy" in the explorer interface
   - Paste the contract code in the editor
   - For the contract name field, enter: `hello-world-c43fe8da`
   - Set fee to 200000 microSTX (0.2 STX)
   - Click "Deploy Contract"
   - Confirm the transaction in your Hiro Wallet

5. **Check deployment status**
   - After confirming, the explorer will show a transaction ID
   - Copy this transaction ID
   - Go to https://explorer.stacks.co/txid/YOUR_TRANSACTION_ID?chain=testnet (replace YOUR_TRANSACTION_ID)
   - Monitor the status of the transaction

## After Deployment

If the deployment succeeds, you'll be able to interact with your contract at:
`ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.hello-world-c43fe8da`

You can test the contract functions:
- Go to https://explorer.stacks.co/sandbox/contract-call?chain=testnet
- Enter the contract address above
- Select the function you want to call (greet or greet-name)
- For greet-name, provide a string parameter
- Click "Call Function"

## Conclusion

If this approach succeeds where our script-based deployment failed, it would suggest the issue is with the API or our deployment script rather than the testnet itself or our contract code.

Please document the result of this manual deployment attempt, especially any error messages that appear, as this will help us diagnose the underlying issue.