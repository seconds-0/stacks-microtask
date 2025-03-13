# Stacks Microtask - Decentralized Micro-Task Bounty Board

A proof-of-concept decentralized application (dApp) for posting, claiming, and completing micro-tasks in exchange for STX tokens on the Stacks blockchain.

## Overview

This dApp allows users to:

- Post tasks with descriptions and STX rewards
- Claim tasks posted by others
- Approve completed tasks to release the STX reward to the claimer
- View all available, claimed, and completed tasks

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

## Notes

This is a proof-of-concept implementation. For a production application, consider adding:

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
