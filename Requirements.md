Project Requirements: Decentralized Micro-Task Bounty Board (Proof-of-Concept)
Overview
This document outlines the requirements and implementation plan for a decentralized application (dApp) that allows users to post, claim, and complete micro-tasks in exchange for STX rewards. The dApp will be built on the Stacks blockchain, leveraging its security and smart contract capabilities through the Clarity language. This proof-of-concept (PoC) focuses on core functionality, omitting advanced features like user profiles or a backend server, to demonstrate the fundamental interaction between a frontend and a Stacks smart contract.
The goal is to create a simple, functional system where:
Task Posters can create tasks with descriptions and STX rewards.

Task Claimers can claim tasks and receive rewards upon approval.

All interactions are handled via a basic frontend connected to the Stacks blockchain.

Key Technologies
Clarity: Smart contract language for Stacks.

Clarinet: Development toolkit for Clarity contracts.

Stacks.js: JavaScript library for interacting with the Stacks blockchain.

Vitest: Testing framework for unit tests.

Hiro Wallet: For user authentication and transaction signing.

Functional Requirements
User Roles
Task Poster: Can create tasks with a description and an STX reward.

Task Claimer: Can claim an open task and receive the reward upon approval.

Task Lifecycle
Posting a Task:
The poster provides a task description (max 256 characters) and an STX reward amount.

The poster must have sufficient STX balance to cover the reward.

The task is stored on the blockchain with a unique ID.

Claiming a Task:
Any user can claim an open task.

Only one user can claim a task at a time.

The task status changes to "claimed," and the claimer's address is associated with the task.

Approving a Task:
The original poster approves the task once the claimer completes it.

The STX reward is transferred to the claimer.

The task status changes to "completed," and the claimer is reset.

Viewing Tasks:
Users can view a list of tasks with details: description, reward, poster, status, and claimer.

Technical Requirements
File Structure
The project should be organized as follows:

stacks-microtask/
├── Clarinet.toml           # Clarinet configuration
├── contracts/
│   └── microtasks.clar     # Clarity smart contract
├── tests/
│   └── microtasks.test.ts  # Vitest tests
├── vitest.config.ts        # Vitest configuration
├── package.json            # Node dependencies and scripts
└── index.html              # Frontend: HTML, CSS, JavaScript

Smart Contract (contracts/microtasks.clar)
The smart contract must implement the following:
Error Codes: Define constants for errors (e.g., ERR_NO_FUNDS, ERR_TASK_NOT_FOUND).

Data Map: Store tasks with fields: description, reward, poster, status, claimer.

Public Functions:
post-task: Create a new task if the poster has sufficient STX.

claim-task: Allow a user to claim an open task.

approve-task: Allow the poster to approve a claimed task and transfer the reward.

Read-only Functions:
get-task: Retrieve details of a specific task.

get-all-tasks: (Optional) Retrieve all tasks (note: Clarity does not support direct iteration over maps; use off-chain logic or iterate by task ID).

Example Code
clarity

;; microtasks.clar

;; Constants for error handling
(define-constant ERR_NO_FUNDS u1)
(define-constant ERR_TASK_NOT_FOUND u2)
(define-constant ERR_UNAUTHORIZED u3)
(define-constant ERR_ALREADY_CLAIMED u4)
(define-constant ERR_NOT_CLAIMED u5)

;; Data map to store tasks
(define-map tasks
  { task-id: uint }
  {
    description: (string-utf8 256),
    reward: uint,
    poster: principal,
    status: (string-ascii 10),
    claimer: (optional principal)
  }
)

;; Variable to track the number of tasks
(define-data-var task-counter uint u0)

;; Public functions

;; Post a new task with a description and reward
(define-public (post-task (description (string-utf8 256)) (reward uint))
  (let ((task-id (var-get task-counter)))
    (if (>= (stx-get-balance tx-sender) reward)
      (begin
        (map-insert tasks { task-id: task-id }
          {
            description: description,
            reward: reward,
            poster: tx-sender,
            status: "open",
            claimer: none
          }
        )
        (var-set task-counter (+ task-id u1))
        (ok task-id)
      )
      (err ERR_NO_FUNDS)
    )
  )
)

;; Claim an open task
(define-public (claim-task (task-id uint))
  (let ((task (map-get? tasks { task-id: task-id })))
    (match task
      some-task
      (if (and (is-eq (get status some-task) "open")
               (is-none (get claimer some-task)))
        (begin
          (map-set tasks { task-id: task-id }
            (merge some-task { claimer: (some tx-sender), status: "claimed" })
          )
          (ok true)
        )
        (err ERR_ALREADY_CLAIMED)
      )
      (err ERR_TASK_NOT_FOUND)
    )
  )
)

;; Approve a claimed task and transfer the reward
(define-public (approve-task (task-id uint))
  (let ((task (map-get? tasks { task-id: task-id })))
    (match task
      some-task
      (if (and (is-eq tx-sender (get poster some-task))
               (is-eq (get status some-task) "claimed")
               (is-some (get claimer some-task)))
        (let ((claimer (unwrap-panic (get claimer some-task))))
          (try! (stx-transfer? (get reward some-task) tx-sender claimer))
          (map-set tasks { task-id: task-id }
            (merge some-task { status: "completed", claimer: none })
          )
          (ok true)
        )
        (err ERR_UNAUTHORIZED)
      )
      (err ERR_TASK_NOT_FOUND)
    )
  )
)

;; Read-only functions

;; Get details of a specific task
(define-read-only (get-task (task-id uint))
  (map-get? tasks { task-id: task-id })
)

Frontend (index.html)
The frontend should be a single HTML file with inline CSS and JavaScript, providing:
A button to connect the Hiro Wallet.

A form to post new tasks.

A list to display tasks with options to claim or approve them.

Clear feedback for transaction confirmations and errors.

Example Code (Partial)
html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Micro-Task Bounty Board</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .task { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
    button { margin: 5px; padding: 5px 10px; }
  </style>
</head>
<body>
  <h1>Micro-Task Bounty Board</h1>
  <button id="connect-wallet">Connect Wallet</button>
  <div id="wallet-info"></div>

  <h2>Post a Task</h2>
  <form id="post-task-form">
    <input type="text" id="task-description" placeholder="Task Description" required>
    <input type="number" id="task-reward" placeholder="Reward (uSTX)" required>
    <button type="submit">Post Task</button>
  </form>

  <h2>Tasks</h2>
  <div id="task-list"></div>

  <script src="https://unpkg.com/@stacks/connect@latest/dist/index.umd.js"></script>
  <script>
    const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with deployed address
    const contractName = 'microtasks';

    // Wallet connection
    document.getElementById('connect-wallet').addEventListener('click', () => {
      stacksConnect.showUserData();
    });

    // Post task form submission (placeholder logic)
    document.getElementById('post-task-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.getElementById('task-description').value;
      const reward = document.getElementById('task-reward').value;
      console.log(`Posting task: ${description}, Reward: ${reward} uSTX`);
      // Add Stacks.js logic to call post-task function
    });

    // Display tasks (placeholder logic)
    async function displayTasks() {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '<p>Loading tasks...</p>';
      // Add Stacks.js logic to fetch and display tasks from get-task
    }

    // Initial load
    displayTasks();
  </script>
</body>
</html>

Testing (tests/microtasks.test.ts)
Tests should be written using Vitest and the Clarinet JS SDK to ensure the smart contract functions as expected.
Example Code
typescript

// microtasks.test.ts
import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("microtasks", () => {
  it("allows a user to post a task", () => {
    const { result } = simnet.callPublicFn(
      "microtasks",
      "post-task",
      [Cl.stringUtf8("Test task"), Cl.uint(1000000)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(0));
  });

  it("allows a user to claim a task", () => {
    simnet.callPublicFn(
      "microtasks",
      "post-task",
      [Cl.stringUtf8("Task to claim"), Cl.uint(1000000)],
      wallet1
    );
    const { result } = simnet.callPublicFn(
      "microtasks",
      "claim-task",
      [Cl.uint(0)],
      wallet2
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("allows the poster to approve a claimed task", () => {
    simnet.callPublicFn(
      "microtasks",
      "post-task",
      [Cl.stringUtf8("Task to approve"), Cl.uint(1000000)],
      wallet1
    );
    simnet.callPublicFn(
      "microtasks",
      "claim-task",
      [Cl.uint(0)],
      wallet2
    );
    const { result } = simnet.callPublicFn(
      "microtasks",
      "approve-task",
      [Cl.uint(0)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("prevents claiming an already claimed task", () => {
    simnet.callPublicFn(
      "microtasks",
      "post-task",
      [Cl.stringUtf8("Task already claimed"), Cl.uint(1000000)],
      wallet1
    );
    simnet.callPublicFn(
      "microtasks",
      "claim-task",
      [Cl.uint(0)],
      wallet2
    );
    const { result } = simnet.callPublicFn(
      "microtasks",
      "claim-task",
      [Cl.uint(0)],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(4)); // ERR_ALREADY_CLAIMED
  });
});

Implementation Plan
1. Environment Setup
Install Node.js and NPM: Ensure Node.js (≥ 18.0.0) and NPM are installed.

Install Clarinet CLI: Run npm install -g @stacks/clarinet.

Create Project: Run clarinet new stacks-microtask and navigate to the directory.

Install Dependencies: Run npm install.

Install Testing Dependencies: Run npm install --save-dev vitest @vitest/coverage-c8.

Create Vitest Config: Add vitest.config.ts with:
typescript

import { defineConfig } from "vitest/config";
export default defineConfig({ test: { globals: true } });

Add Scripts to package.json:
json

"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "coverage": "vitest run --coverage"
}

2. Smart Contract Development
Create Contract: Run clarinet contract new microtasks.

Implement Contract: Add the code from the example above to contracts/microtasks.clar.

Check Syntax: Run clarinet check to verify the contract.

3. Testing
Create Test File: Add tests/microtasks.test.ts.

Write Tests: Use the example test code to cover posting, claiming, approving tasks, and error conditions.

Run Tests: Use npm test to execute tests and npm run coverage for coverage reports.

4. Frontend Development
Create index.html: Add the HTML, CSS, and JavaScript from the example.

Implement Wallet Connection: Use Stacks.js to connect to Hiro Wallet.

Add Task Interactions: Implement forms and buttons for posting, claiming, and approving tasks.

Handle Errors: Display user-friendly messages for transaction outcomes.

5. Integration and Validation
Test Locally: Use Clarinet’s local environment to test the contract with the frontend.

Validate Transactions: Ensure wallet connections and transactions work as expected.

Test Task Lifecycle: Post, claim, and approve a task to verify the full flow.

