# 🔥 Stacks Micro-Task Board

A decentralized micro-task platform built on the Stacks blockchain. Post tasks, earn STX, and build your reputation on-chain. Now available on Stacks Testnet!

## Features

- **Post Tasks**: Create tasks with STX rewards
- **Claim Tasks**: Find and claim available tasks to complete
- **Approve & Pay**: Review completed tasks and release payment
- **Blockchain Backed**: All data stored securely on the Stacks blockchain
- **User-Friendly**: Modern UI with responsive design
- **Wallet Integration**: Seamless Hiro Wallet connection

## Smart Contract

The Micro-Task Board is powered by the `microtasks-minimal` Clarity smart contract deployed on the Stacks testnet at:

```
ST29ZH6JAYVPQT1BRRFZ3K0EJCT0W50Q5E309N45A.microtasks-minimal
```

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- NPM (v7 or higher) 
- Clarinet (for Clarity contract development)
- A [Hiro Wallet](https://wallet.hiro.so/) for testing

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stacks-microtask.git
   cd stacks-microtask
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Testnet Deployment

### 1. Configure Testnet Settings

The project includes a Testnet configuration in `settings/Testnet.toml`. Before deploying, update with your deployment wallet's mnemonic:

```toml
[network]
name = "testnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your-testnet-mnemonic-here"
balance = 1000000000000 # 1000 STX in microSTX
```

### 2. Fund Your Account

Visit the [Stacks testnet faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet) and request STX tokens for your testnet address.

### 3. Deploy the Smart Contract

```bash
clarinet deploy --testnet
```

After deployment, note your contract's address and update the `contractAddress` in `index.html` with your deployed contract address.

## Deployment Options

This application can be deployed to any standard NodeJS hosting platform, including:

### Deploying to Render

1. Fork this repository to your GitHub account
2. Sign up for a [Render](https://render.com/) account 
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure the deployment:
   - **Build Command**: `npm run deploy:prepare`
   - **Start Command**: `npm start`
   - **Environment Variables**: None required for basic setup

### Deploying to Vercel

1. Fork this repository to your GitHub account
2. Sign up for a [Vercel](https://vercel.com/) account
3. Create a new project and import your GitHub repository
4. Configure the deployment:
   - **Build Command**: `npm run deploy:prepare`
   - **Output Directory**: (leave as default)
   - **Install Command**: `npm install`

### Deploying to DigitalOcean App Platform

1. Sign up for a [DigitalOcean](https://digitalocean.com/) account
2. Create a new App
3. Connect your GitHub repository
4. Configure the deployment:
   - **Environment**: Node.js
   - **Build Command**: `npm run deploy:prepare`
   - **Run Command**: `npm start`

## Contract Development

The Clarity smart contracts are located in the `contracts/` directory. For contract development and testing:

1. Check contract syntax:
   ```bash
   npm run check
   ```

2. Run contract tests:
   ```bash
   npm run test
   ```

3. Deploy contract using Clarinet:
   ```bash
   clarinet deploy --testnet
   ```

## Smart Contract Details

The Stacks Micro-Task Board uses a Clarity smart contract with the following main functions:

- `post-task`: Create a new task with a description and STX reward
- `claim-task`: Claim an available task 
- `approve-task`: Approve a completed task and transfer the reward
- `get-task`: Retrieve information about a specific task

### Data Structure:

Tasks are stored with the following properties:
- `description`: Task description (string-utf8 256)
- `reward`: STX reward amount (uint)
- `poster`: Address of the task creator (principal)
- `claimer`: Address of the claimer, if claimed (optional principal)
- `status`: Current task status ("open", "claimed", or "completed")

## Using the Testnet dApp

1. Visit your deployed frontend URL
2. Make sure your Hiro Wallet is set to testnet mode:
   - Open Hiro Wallet extension
   - Go to Settings > Network > Select "Testnet"
3. Connect your wallet by clicking the "Connect Wallet" button
4. Post tasks:
   - Enter a description
   - Specify the STX reward amount
   - Submit and confirm the transaction in your wallet
5. Claim tasks:
   - Browse available tasks
   - Click "Claim Task" on any task you want to work on
   - Confirm the transaction in your wallet
6. Approve tasks:
   - For tasks you've posted, click "Approve & Pay" once the claimer has completed the work
   - Confirm the transaction to release the funds to the claimer

All transactions will be visible in the [Stacks Explorer](https://explorer.stacks.co/?chain=testnet) on testnet.

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/language-overview)
- [Hiro Wallet](https://wallet.hiro.so/)
- [Stacks Explorer](https://explorer.stacks.co/?chain=testnet)

## License

MIT