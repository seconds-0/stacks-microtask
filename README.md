# Stacks Microtask - Decentralized Micro-Task Bounty Board

A decentralized application (dApp) for posting, claiming, and completing micro-tasks in exchange for STX tokens on the Stacks blockchain. Now available on Stacks Testnet!

## Overview

This dApp allows users to:

- Post tasks with descriptions and STX rewards
- Claim tasks posted by others
- Approve completed tasks to release the STX reward to the claimer
- View all available, claimed, and completed tasks
- Connect with Hiro Wallet on Stacks Testnet for real blockchain interactions

## Project Structure

- `contracts/microtasks.clar` - Clarity smart contract
- `tests/microtasks.test.ts` - Comprehensive test suite
- `index.html` - Frontend interface with wallet integration
- `settings/` - Configuration files for Clarinet

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [Clarinet](https://github.com/hirosystems/clarinet/releases/latest) - Stacks development framework
- [Hiro Wallet](https://wallet.hiro.so/wallet/install-web) browser extension for testing the frontend

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

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

### 4. Host the Frontend

You can host the frontend using a simple HTTP server or deploy to a service like Netlify:

```bash
# Local testing
python -m http.server 8080
```

For production, upload the `index.html` file to a web hosting service.

## Development

### Check Contract Syntax

```bash
npm run check
# or directly with Clarinet
clarinet check
```

### Run Tests

```bash
npm run test
# or directly with Clarinet
clarinet test
```

> Note: Tests must be run using the Clarinet test runner, not with vitest directly, as Clarinet injects the `simnet` object that our tests require.

### Serve the Frontend

Use the built-in script to serve the frontend:

```bash
npm run serve
```

Then navigate to `http://localhost:8080` in your browser.

## Smart Contract Details

The Clarity smart contract (`microtasks.clar`) implements:

### Public Functions:

- `post-task` - Creates a new task with a description and STX reward
  - Parameters: `description (string-utf8 256)`, `reward (uint)`
  - Returns: Task ID if successful

- `claim-task` - Allows a user to claim an available task
  - Parameters: `task-id (uint)`, `poster (principal)`
  - Returns: `true` if successful

- `approve-task` - Allows the task poster to approve a claimed task and release the STX reward
  - Parameters: `task-id (uint)`
  - Returns: `true` if successful

### Read-Only Functions:

- `get-task` - Retrieves information about a specific task
  - Parameters: `task-id (uint)`, `poster (principal)`
  - Returns: Task details or `none` if not found

- `get-all-tasks` - Retrieves a list of tasks (with limits for this PoC implementation)

### Data Structure:

Tasks are stored with the following properties:
- `description`: Task description (string-utf8 256)
- `reward`: STX reward amount (uint)
- `poster`: Address of the task creator (principal)
- `claimer`: Address of the claimer, if claimed (optional principal)
- `completed`: Whether the task is completed (boolean)
- `status`: Current task status ("open", "claimed", or "completed")

## Frontend

The frontend interface provides:

- Stacks wallet connection with Stacks.js
- Simple form for posting new tasks
- Visual task listing with different styling based on status
- Action buttons for claiming and approving tasks
- Status notifications for transaction confirmations

## Testing

The test suite covers:

- Task posting functionality
- Task claiming functionality
- Task approval and reward payment
- Error handling for various edge cases
- State transitions between task statuses

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

## Notes

This implementation includes:
- Full Stacks Testnet integration
- Wallet authentication for all actions
- Real STX token transfers on testnet
- Transaction status feedback with explorer links

Future enhancements could include:
- Better error handling and input validation
- Pagination for task listing
- User profiles and reputation systems
- Task filtering and search capabilities
- Task dispute resolution mechanisms
- Additional security measures against spam and abuse
- Task categories and tags
- Time limits for task completion

## License

MIT
