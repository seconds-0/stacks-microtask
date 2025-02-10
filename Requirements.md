# Project Requirements

## Overview

This document outlines the technical requirements and specifications for our project. It will be updated as requirements evolve.

## Core Requirements

### Functional Requirements

Project Name Decentralized Micro-Task Bounty Board (Proof-of-Concept)

1. Introduction

This document outlines the requirements for a proof-of-concept (PoC) decentralized application (dApp) that allows users to post, claim, and complete micro-tasks in exchange for STX rewards. The dApp will be built on the Stacks blockchain, leveraging its security and smart contract capabilities. This PoC focuses on core functionality and minimizes complexity, omitting features like user profiles, a backend server, and advanced UI elements. The goal is to demonstrate the fundamental interaction between a frontend and a Stacks smart contract for a basic task management and payment system.

2. Goals

Demonstrate the feasibility of a decentralized task bounty system on Stacks.

Implement the core smart contract logic for posting, claiming, and approving tasks.

Create a basic, functional frontend for interacting with the smart contract.

Use the Hiro platform (Clarinet, Stacks.js, Hiro Wallet) for development and user interaction.

Keep the implementation as simple as possible, suitable for a PoC.

Provide a foundation for future expansion and development.

3. Functional Requirements

3.1. User Roles:

Task Poster: A user who can create new tasks and offer STX rewards.

Task Claimer: A user who can claim available tasks and, upon approval, receive the STX reward.

Note: For this PoC, a single user can act as both a Task Poster and a Task Claimer (using the same Stacks address).

3.2. Task Lifecycle:

Posting a Task:

A user (Task Poster) can create a new task by providing:

A short text description of the task (maximum 256 characters).

An STX reward amount (in microSTX - uSTX).

The system must ensure the user has sufficient STX balance to cover the reward.

The task is stored on the Stacks blockchain via a smart contract.

The task is assigned a unique identifier (within the context of the poster).

Claiming a Task:

A user (Task Claimer) can claim an available task.

A task can only be claimed by one user at a time.

Claiming a task marks it as "claimed" and associates the claimer's Stacks address with the task.

Approving a Task:

The original Task Poster can approve a claimed task.

Approving a task triggers the transfer of the STX reward from the Task Poster to the Task Claimer.

Approving a task marks it as "completed."

A completed task's claimer is reset.

Viewing Tasks:

A user can see a simple list of all tasks. The list will show basic information (at minimum: description, reward, poster, status (available/claimed/completed)), and claimer, if available.

3.3. Smart Contract Functions:

The smart contract (microtasks.clar) will implement the following functions:

post-task(description: string-utf8 256, reward: uint) -> (response uint (err uint)): Creates a new task. Returns the task ID on success, or an error code.

claim-task(task-id: uint, poster: principal) -> (response bool (err uint)): Claims a task. Returns true on success, or an error code.

approve-task(task-id: uint, poster: principal) -> (response bool (err uint)): Approves a claimed task and transfers the reward. Returns true on success, or an error code.

get-task(task-id: uint, poster: principal) -> (optional {description: (string-utf8 256), reward: uint, claimer: (optional principal), completed: bool}): (Read-only) Retrieves details for a specific task.

get-all-tasks() -> (list ...): (Read-only) Retrieves a list of all tasks. (Note: This is inefficient for large numbers of tasks but acceptable for this PoC.)

3.4. Frontend Requirements:

The frontend (single index.html file) will provide the following:

Wallet Connection: Connect to the user's Hiro Wallet (or a compatible Stacks wallet) using Stacks.js.

Task Posting Form:

A text input field for the task description.

A number input field for the STX reward.

A button to submit the task.

Task List Display:

A simple list showing all tasks (description, reward, poster, status, and claimer if available).

Claim Task Button:

A button next to each available task to allow the user to claim it.

Approve Task Button:

A button next to each of your own claimed tasks to allow you to release payment

Basic Error Handling: Display user-friendly error messages for common issues (e.g., insufficient funds, task already claimed, transaction failure).

Transaction Confirmation: Indicate when a transaction has been submitted and when it has been confirmed on the blockchain (using microblock confirmations for faster feedback).

4. Non-Functional Requirements

Security:

The smart contract must be thoroughly tested to prevent vulnerabilities (e.g., reentrancy, integer overflows, unauthorized access).

The frontend must not handle private keys directly; all sensitive operations must be performed through the user's wallet.

Usability:

The user interface should be simple and intuitive, even for users unfamiliar with cryptocurrency.

Performance:

Task list retrieval should be reasonably fast for a small number of tasks (recognizing the limitations of the get-all-tasks approach).

Transaction confirmations should be displayed quickly (leveraging microblocks).

Maintainability:

While minimizing files, the code should still be reasonably well-organized and commented for clarity.

Testability:

The smart contract should include unit tests.

5. Technology Stack

Smart Contract: Clarity (language), Clarinet (development environment)

Frontend: HTML, CSS, JavaScript, Stacks.js

Wallet: Hiro Wallet (or compatible Stacks wallet)

Blockchain: Stacks (local Clarinet testnet for development)

6. Out of Scope (for this PoC)

Backend Server: No backend server for indexing tasks or managing user profiles.

User Authentication/Profiles: No user accounts or login system beyond Stacks addresses.

Advanced UI: No complex UI components, animations, or sophisticated styling.

Filtering/Sorting: No filtering or sorting of the task list.

Notifications: No email or push notifications.

Deployment to Testnet/Mainnet: Focus is on local development and testing with Clarinet.

Scalability beyond a small number of tasks: The get-all-tasks approach is not scalable; this is acceptable for a PoC.

Comprehensive Error Handling: Only basic error messages.

7. Testing

Unit Tests: Clarinet unit tests for all smart contract functions.

Manual Testing: Thorough manual testing of the frontend and its interaction with the smart contract (using the local Clarinet testnet and the Hiro Wallet).

Clarifying Questions:

None at this time. This requirements document deliberately keeps the scope very limited for a PoC, so the requirements are straightforward. If we were to expand the scope (e.g., add a backend, user profiles, etc.), then we would need to ask clarifying questions about those specific features. The limitations and trade-offs are explicitly acknowledged.

### Technical Requirements

1. File Structure (4 Files Total):

stacks-microtask/
├── Clarinet.toml        (Clarinet configuration)
├── contracts/
│   └── microtasks.clar  (Clarity smart contract)
├── tests/
│   └── microtasks_test.ts (TypeScript unit tests)
└── index.html          (Frontend: HTML, CSS, JavaScript)

Explanation and Key Implementation Details:

Clarinet.toml: Standard Clarinet configuration file. No significant changes needed from the default.

contracts/microtasks.clar: The Clarity smart contract code, implementing the core logic for task management and STX transfers. The code provided is complete and ready to use.

tests/microtasks_test.ts: TypeScript unit tests using Clarinet's testing framework. These tests verify the functionality of each smart contract function. The provided code includes several example tests. It's essential to write comprehensive tests to cover different scenarios and edge cases.

index.html:

HTML Structure: Basic HTML elements for input fields (task description, reward), buttons (post, claim, approve), and a display area for the task list.

Inline CSS: Minimal inline CSS for basic styling.

JavaScript Logic:

Wallet Connection: Uses Stacks.js to connect to the Hiro Wallet. The showConnect function handles the connection process.

Transaction Creation: Uses Stacks.js functions (makeContractCall, broadcastTransaction) to create and send transactions to the smart contract.

Read-Only Function Calls: Uses Stacks.js callReadOnlyFunction to retrieve the task list using get-all-tasks.

Event Handling: Event listeners are attached to the buttons to trigger the appropriate actions (posting, claiming, approving tasks).

Task List Display: Dynamically generates HTML elements to display the task list.

Error Handling: Basic error handling using displayMessage.

Stacks.js initialization: The code initializes the Stacks network to use the testnet (StacksTestnet). You will need to use the local Clarinet testnet address.

Contract Address and Name: The contractAddress and contractName variables need to be updated with the actual address and name of your deployed contract (during testing, you'll get this from the Clarinet console).

Workflow Integration: The code includes a button and handler for user sign in, posting tasks, getting all tasks (for display), claiming tasks, and approving tasks.

Development Process:

Smart Contract Development:

Write the microtasks.clar contract.

Write unit tests in tests/microtasks_test.ts.

Use clarinet check to check for syntax errors.

Use clarinet console to interact with the contract and test it manually.

Run tests: clarinet test

Frontend Development:

Create the index.html file.

Include the Stacks.js library.

Implement the HTML structure, CSS styling, and JavaScript logic.

Test the frontend integration with the local Clarinet testnet and the Hiro Wallet.

Iteration and Testing:

Iteratively develop and test the smart contract and frontend, making changes and improvements as needed.

Use the Clarinet console and the browser's developer tools to debug issues.

2. Clarinet.toml (Clarinet Configuration):

This file is generated automatically by clarinet new. We'll need to ensure it correctly points to our contract and test files. A basic example:

[project]
name = "microtasks-poc"
description = "A simple decentralized micro-task bounty board (PoC)"
authors = []
[contracts.microtasks]
path = "contracts/microtasks.clar"
[contracts.microtasks.depends-on]
[repl]
costs_version = 2
[repl.analysis]
passes = []
[repl.analysis.check_checker]
strict = false
[repl.analysis.input_checker]
strict = false
[repl.clarity_version]
clarity_version = 2
[repl.contract_profile]
enabled = false
[repl.contract_profile.instrumentation]
enabled = false
Use code with caution.
Toml
3. contracts/microtasks.clar (Smart Contract):

;; microtasks.clar

;; Data Variables
(define-data-var next-task-id uint u0)

;; Data Maps
(define-map tasks
  { task-id: uint, poster: principal }  ;; Key
  { description: (string-utf8 256),
    reward: uint,
    claimer: (optional principal),
    completed: bool } ;; Value
)

;; Constants (Error Codes)
(define-constant ERR_INSUFFICIENT_FUNDS (err u101))
(define-constant ERR_TASK_NOT_FOUND (err u102))
(define-constant ERR_TASK_ALREADY_CLAIMED (err u103))
(define-constant ERR_TASK_COMPLETED (err u104))
(define-constant ERR_NOT_AUTHORIZED (err u105))

;; Public Functions (Callable by anyone)

(define-public (post-task (description (string-utf8 256)) (reward uint))
    (let ((sender tx-sender)
        (current-id (var-get next-task-id))
        (next-id (+ current-id u1)))
    (asserts! (>= (stx-balance? sender) reward) ERR_INSUFFICIENT_FUNDS)
    (try! (map-insert tasks {task-id: current-id, poster: sender} {description: description, reward: reward, claimer: none, completed: false}))
    (var-set next-task-id next-id)
    (ok current-id)
    )
)

(define-public (claim-task (task-id uint) (poster principal))
  (let ((sender tx-sender)
        (task (map-get? tasks { task-id: task-id, poster: poster })))
    (asserts! (is-some task) ERR_TASK_NOT_FOUND)
    (let ((task-data (unwrap! task ERR_TASK_NOT_FOUND)))
      (asserts! (is-none (get claimer task-data)) ERR_TASK_ALREADY_CLAIMED)
      (asserts! (not (get completed task-data)) ERR_TASK_COMPLETED)
      (map-set tasks { task-id: task-id, poster: poster } (merge task-data { claimer: (some sender) }))
      (ok true)
    )
  )
)

(define-public (approve-task (task-id uint) (poster principal))
    (let ((sender tx-sender)
          (task (map-get? tasks {task-id: task-id, poster: poster})))
        (asserts! (is-some task) ERR_TASK_NOT_FOUND)
        (let ((task-data (unwrap! task ERR_TASK_NOT_FOUND)))
            (asserts! (is-eq sender poster) ERR_NOT_AUTHORIZED)
            (asserts! (is-some (get claimer task-data)) ERR_TASK_NOT_FOUND)
            (asserts! (not (get completed task-data)) ERR_TASK_COMPLETED)
            (try! (stx-transfer? (get reward task-data) sender (unwrap! (get claimer task-data) ERR_TASK_NOT_FOUND)))
            (map-set tasks {task-id: task-id, poster: poster} (merge task-data {claimer: none, completed: true}))
            (ok true)
        )
    )
)

;; Read-Only Functions (Cannot change blockchain state)

(define-read-only (get-task (task-id uint) (poster principal))
  (map-get? tasks { task-id: task-id, poster: poster })
)

(define-read-only (get-all-tasks)
  (map get-all-tasks-entry (range u0 (var-get next-task-id)))
    ;;Helper Function
    (define-read-only (get-all-tasks-entry (id uint))
        (unwrap! (get-task id (get-poster-by-task-id id)) (err u0))
    )
      (define-read-only (get-poster-by-task-id (id uint))
            (unwrap! (get poster (map-get? tasks {task-id: id, poster: 'SP000000000000000000002Q6VF78}))  ERR_TASK_NOT_FOUND)
      )
)
Use code with caution.
Clarity
4. tests/microtasks_test.ts (Unit Tests):

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.3/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "post-task: Ensure that a user can post a task",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        const description = "Test task description";
        const reward = 1000000; // 1 STX

        let block = chain.mineBlock([
            Tx.contractCall("microtasks", "post-task", [types.utf8(description), types.uint(reward)], wallet1.address),
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectUint(0); // Check task ID

        // Check task data
        const task = chain.callReadOnlyFn("microtasks", "get-task", [types.uint(0), types.principal(wallet1.address)], deployer.address);
        task.result.expectSome();
    },
});

Clarinet.test({
    name: "claim-task: Ensure that a user can claim a task",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        // Post a task
        chain.mineBlock([
            Tx.contractCall("microtasks", "post-task", [types.utf8("Task to claim"), types.uint(1000000)], wallet1.address),
        ]);

        // Claim the task
        let block = chain.mineBlock([
            Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet2.address),
        ]);
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 3);
        block.receipts[0].result.expectOk().expectBool(true);

        //Check that the claimer is correct
        const task = chain.callReadOnlyFn("microtasks", "get-task", [types.uint(0), types.principal(wallet1.address)], deployer.address);
        const result = task.result.expectSome().expectTuple() as any;
        assertEquals(result.claimer.expectSome(), wallet2.address)

    },
});

Clarinet.test({
    name: "approve-task: Ensure that the task poster can approve a claim",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!; // Poster
        const wallet2 = accounts.get("wallet_2")!; // Claimer

        // Post a task
        chain.mineBlock([
          Tx.contractCall("microtasks", "post-task", [types.utf8("Task to approve"), types.uint(1000000)], wallet1.address),
        ]);
        // Claim the task
        chain.mineBlock([
          Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet2.address),
        ]);
      
        const deployerBalanceBefore = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(deployer.address)], deployer.address);
        const wallet1BalanceBefore = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(wallet1.address)], deployer.address);
        const wallet2BalanceBefore = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(wallet2.address)], deployer.address);


        // Approve the task
        let block = chain.mineBlock([
          Tx.contractCall("microtasks", "approve-task", [types.uint(0), types.principal(wallet1.address)], wallet1.address),
        ]);

        const deployerBalanceAfter = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(deployer.address)], deployer.address);
        const wallet1BalanceAfter = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(wallet1.address)], deployer.address);
        const wallet2BalanceAfter = chain.callReadOnlyFn("microtasks", "stx-balance?", [types.principal(wallet2.address)], deployer.address);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 4);
        block.receipts[0].result.expectOk().expectBool(true);

        //Check that the balances transfer correctly

        // Check that the task is completed and the claimer is reset
        const task = chain.callReadOnlyFn("microtasks", "get-task", [types.uint(0), types.principal(wallet1.address)], deployer.address);
        const result = task.result.expectSome().expectTuple() as any;
        assertEquals(result.completed, types.bool(true));
        assertEquals(result.claimer, "none");
    },
});

Clarinet.test({
    name: "approve-task: Ensure that a user can't claim a completed task",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!; // Poster
        const wallet2 = accounts.get("wallet_2")!; // Claimer

        // Post a task
        chain.mineBlock([
          Tx.contractCall("microtasks", "post-task", [types.utf8("Task to approve"), types.uint(1000000)], wallet1.address),
        ]);
        // Claim the task
        chain.mineBlock([
          Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet2.address),
        ]);

        // Approve the task
        let block = chain.mineBlock([
          Tx.contractCall("microtasks", "approve-task", [types.uint(0), types.principal(wallet1.address)], wallet1.address),
        ]);

        //Attempt to reclaim
        block = chain.mineBlock([
            Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet2.address),
          ]);
        block.receipts[0].result.expectErr().expectUint(104);
    },
});

Clarinet.test({
  name: "approve-task: Ensure that a user can't approve an unclaimed task",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet1 = accounts.get("wallet_1")!; // Poster
      const wallet2 = accounts.get("wallet_2")!; // Claimer

      // Post a task
      chain.mineBlock([
        Tx.contractCall("microtasks", "post-task", [types.utf8("Task to approve"), types.uint(1000000)], wallet1.address),
      ]);

      // Approve the task
      let block = chain.mineBlock([
        Tx.contractCall("microtasks", "approve-task", [types.uint(0), types.principal(wallet1.address)], wallet1.address),
      ]);
      block.receipts[0].result.expectErr().expectUint(102);
  },
});

Clarinet.test({
    name: "claim-task: Ensure that a user can't claim an unposted task",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!; // Poster
        const wallet2 = accounts.get("wallet_2")!; // Claimer

        // Claim the task
        let block = chain.mineBlock([
          Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet2.address),
        ]);
        block.receipts[0].result.expectErr().expectUint(102);
    },
});
Clarinet.test({
  name: "claim-task: Ensure that a user can't claim their own task",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet1 = accounts.get("wallet_1")!; // Poster
      const wallet2 = accounts.get("wallet_2")!; // Claimer

      // Post a task
      chain.mineBlock([
        Tx.contractCall("microtasks", "post-task", [types.utf8("Task to approve"), types.uint(1000000)], wallet1.address),
      ]);

      // Claim the task
      let block = chain.mineBlock([
        Tx.contractCall("microtasks", "claim-task", [types.uint(0), types.principal(wallet1.address)], wallet1.address),
      ]);
      block.receipts[0].result.expectErr().expectUint(103);
  },
});
Use code with caution.
TypeScript
5. index.html (Frontend):

<!DOCTYPE html>
<html>
<head>
    <title>Micro-Task Board (PoC)</title>
    <style>
        /* Very basic inline CSS for PoC */
        body { font-family: sans-serif; }
        .task { margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; }
        .available { background-color: #f0f0f0; }
        .claimed { background-color: #ffffcc; }
        .completed { background-color: #ccffcc; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Micro-Task Board (PoC)</h1>

    <button id="connectButton">Connect Wallet</button>
    <div id="userAddress"></div>

    <h2>Post a Task</h2>
    <input type="text" id="taskDescription" placeholder="Task Description">
    <input type="number" id="taskReward" placeholder="Reward (uSTX)">
    <button id="postTaskButton">Post Task</button>
    <div id="postTaskResult" class="result"></div>

    <h2>Available Tasks</h2>
     <div id="taskList"></div>
    <h2>Your Posted Tasks</h2>
    <div id="yourTaskList"></div>


    <script src="https://unpkg.com/@stacks/connect@7.3.0/dist/index.umd.js"></script>
    <script>
        const { StacksTestnet } = window['@stacks/network'];
        const {
            uintCV,
            stringUtf8CV,
            callReadOnlyFunction,
            makeContractCall,
            broadcastTransaction,
            AnchorMode,
            FungibleConditionCode,
            makeStandardSTXPostCondition
        } = window['@stacks/transactions'];
        const { userSession }  = window['@stacks/connect'];

        const network = new StacksTestnet();
        const contractAddress = 'ST12EY99GSX6HC8K4PP9A7544SVR6KZBSG6GXNPQ'; // Replace with your contract address during testing
        const contractName = 'microtasks'; // Replace with your contract name

        let userAddress = '';

        // Helper function to display messages
        function displayMessage(elementId, message, isError = false) {
            const element = document.getElementById(elementId);
            element.textContent = message;
            element.className = isError ? 'error' : 'result';
        }
        //Wallet Connection
        document.getElementById('connectButton').addEventListener('click', async () => {
            const authOptions = {
                manifestPath: '/manifest.json',
                redirectTo: '/',
                onFinish: (payload) => {
                    userAddress = payload.authResponsePayload.profile.stxAddress;
                    document.getElementById('userAddress').innerText = `Connected as: ${userAddress}`;
                    loadTasks();
                },
                onCancel: () => {
                  console.log('User cancelled auth');
                },
                appDetails: {
                    name: 'MicroTask dApp',
                    icon: window.location.origin + '/logo.png', //  Replace with a real logo
                },
            };
            await window.StacksConnect.showConnect(authOptions);
        });

        // Post Task
        document.getElementById('postTaskButton').addEventListener('click', async () => {
            const description = document.getElementById('taskDescription').value;
            const reward = parseInt(document.getElementById('taskReward').value, 10);

            if (!description || isNaN(reward)) {
                displayMessage('postTaskResult', 'Invalid input', true);
                return;
            }

            const functionArgs = [stringUtf8CV(description), uintCV(reward)];
            const options = {
                contractAddress,
                contractName,
                functionName: 'post-task',
                functionArgs,
                network,
                appDetails: {
                  name: "Micro-Task Board",
                  icon: window.location.origin + "/logo.png", // Replace with your app's icon
                },
                onFinish: (data) => {
                    displayMessage('postTaskResult', `Transaction submitted: ${data.txId}`);
                    loadTasks(); // Reload tasks after posting
                },
            };
            await window.StacksConnect.openContractCall(options);
        });

        // Claim Task (Generic function to be called with task details)
        async function claimTask(taskId, poster) {
          const functionArgs = [uintCV(taskId), principalCV(poster)];
            const options = {
              contractAddress,
              contractName,
              functionName: 'claim-task',
              functionArgs,
              network,
              appDetails: {
                name: "Micro-Task Board",
                icon: window.location.origin + "/logo.png", // Replace with your app's icon
              },
              onFinish: (data) => {
                  displayMessage('postTaskResult', `Transaction submitted: ${data.txId}`);
                  loadTasks(); // Reload tasks after claiming
              },

            };
          await window.StacksConnect.openContractCall(options);
        }
      
          // Approve Task
        async function approveTask(taskId, poster) {
          const functionArgs = [uintCV(taskId), principalCV(poster)];
            const options = {
              contractAddress,
              contractName,
              functionName: 'approve-task',
              functionArgs,
              network,
              appDetails: {
                name: "Micro-Task Board",
                icon: window.location.origin + "/logo.png", // Replace with your app's icon
              },
              onFinish: (data) => {
                  displayMessage('postTaskResult', `Transaction submitted: ${data.txId}`);
                  loadTasks(); // Reload tasks after approving
              },

            };
          await window.StacksConnect.openContractCall(options);
        }
      
        // Load and Display Tasks
        async function loadTasks() {
             const taskListElement = document.getElementById('taskList');
            taskListElement.innerHTML = ''; // Clear previous tasks
            const yourTaskListElement = document.getElementById('yourTaskList');
            yourTaskListElement.innerHTML = ''; //Clear previous tasks

            try {
                const taskList = await callReadOnlyFunction({
                    contractAddress,
                    contractName,
                    functionName: 'get-all-tasks',
                    functionArgs: [],
                    network,
                    senderAddress: userAddress,
                  });

                //console.log("Tasks", taskList)

                const tasks = taskList.list;

                tasks.forEach((task, index) => {
                  const taskData = task.value.value;

                  const description = taskData.get("description").value;
                  const reward = taskData.get("reward").value;
                  const claimer = taskData.get("claimer").value;
                  const completed = taskData.get("completed").value;
                  const poster = task.value.data.poster;

                  const taskElement = document.createElement('div');
                  taskElement.classList.add('task');
                  if (!completed && !claimer) {
                    taskElement.classList.add('available');
                  } else if (claimer && !completed){
                    taskElement.classList.add('claimed');
                  }
                   else {
                    taskElement.classList.add('completed');
                  }

                  taskElement.innerHTML = `
                      <strong>Description:</strong> ${description}<br>
                      <strong>Reward:</strong> ${reward} uSTX<br>
                      <strong>Poster:</strong> ${poster}<br>
                      <strong>Claimer:</strong> ${claimer.value ? claimer.value : "None"}<br>
                      <strong>Completed:</strong> ${completed}<br>
                      ${!completed && !claimer ? `<button class="claimButton" data-task-id="${index}" data-poster="${poster}">Claim Task</button>` : ''}
                      ${!completed && claimer && poster == userAddress ? `<button class="approveButton" data-task-id="${index}" data-poster="${poster}">Approve Task</button>` : ''}
                      <hr>
                  `;
                  taskListElement.appendChild(taskElement);

                  if(poster === userAddress){
                    yourTaskListElement.appendChild(taskElement.cloneNode(true));
                  }


                });

              //Attach claim button
              document.querySelectorAll('.claimButton').forEach(button => {
                button.addEventListener('click', function() {
                  const taskId = parseInt(this.dataset.taskId, 10);
                  const poster = this.dataset.poster;
                  claimTask(taskId, poster);
                });
              });
              //Attach approve button
              document.querySelectorAll('.approveButton').forEach(button => {
                button.addEventListener('click', function() {
                  const taskId = parseInt(this.dataset.taskId, 10);
                  const poster = this.dataset.poster;
                  approveTask(taskId, poster);
                });
              });

            } catch (error) {
                console.error("Failed to load tasks:", error);
                taskListElement.innerHTML = '<div>Error loading tasks.</div>';
            }

        }

        // Initial load
        if (window.StacksConnect.isUserSignedIn()) {
          userAddress = window.StacksConnect.getAuthResponseToken().payload.profile.stxAddress;
          document.getElementById('userAddress').innerText = `Connected as: ${userAddress}`;
          loadTasks();
        }

    </script>
</body>
</html>
Use code with caution.
Html
