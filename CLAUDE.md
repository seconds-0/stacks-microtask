# CLAUDE.md - Stacks Microtask Project Reference

## Session Management

- After completing a major task or when using `/compact`, summarize work done in memory.md
- Log significant changes, challenges overcome, and important decisions made

## Build/Test Commands

- `npm run test` - Run tests once with vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Run tests with coverage report
- `npm run check` - Check Clarity contract syntax
- `npm run serve` - Serve frontend using Python HTTP server
- `clarinet test` - Run tests with Clarinet runner (required for simnet object)
- `clarinet test tests/microtasks.test.ts` - Run a single test file
- `clarinet check` - Verify contract syntax directly

## Code Style Guidelines

### Clarity Contracts

- Use descriptive error codes as constants (ERR_*)
- Proper error handling with (ok value)/(err code) pattern
- Comprehensive input validation at function start
- Clear contract structure with sections:
  - Data Variables and Maps
  - Constants (Error Codes)
  - Public Functions
  - Read-Only Functions

### TypeScript/Testing

- Use Vitest with Clarinet JS SDK (NOT legacy Clarinet.test approach)
- Use describe/it/expect pattern from Vitest
- Custom matchers for Clarity types (toBeOk, toBeErr, toBeSome, etc.)
- Use Cl helpers from @stacks/transactions for type serialization
- LF line endings (not CRLF)
- Import order: external libs first, then project modules
- Follow this contract interaction pattern:
  ```typescript
  const { result } = simnet.callPublicFn(
    "microtasks",
    "post-task",
    [Cl.stringUtf8("Test task"), Cl.uint(1000000)],
    wallet1
  );
  expect(result).toBeOk(Cl.uint(0));
  ```
- Use `expect(result).toBeErr(Cl.uint(ERR_CODE))` for error assertions

### File Structure

- Maintain this exact structure:
  ```
  stacks-microtask/
  ├── Clarinet.toml
  ├── contracts/
  │   └── microtasks.clar
  ├── tests/
  │   └── microtasks.test.ts
  ├── vitest.config.ts
  ├── package.json
  └── index.html
  ```
- contracts/<name>.clar - Smart contracts
- tests/<name>.test.ts - Tests matching contract names
- Frontend in index.html for simple integration
- Do not add unnecessary files without explicit instruction

## Testing Implementation Guidelines

- Write tests for ALL contract functions
- Cover both positive scenarios and error conditions
- Test balance changes when STX transfers occur
- Reset state between tests to avoid cross-test contamination
- Ensure tests check for specific error codes returned by contract functions

## Cross-Platform Compatibility

- Save all text files with UTF-8 encoding without BOM
- Use LF line endings (not CRLF), as configured in .gitattributes
- For Windows users:
  - Use WSL for Clarinet operations (e.g., clarinet check)
  - Use Command Prompt or PowerShell for Node.js commands

## Frontend Development

- Keep all frontend code in a single index.html file
- Use inline CSS for styling
- Use the Stacks.js library for wallet connection and contract interaction
- Implement responsive error handling with user-friendly messages
- Handle asynchronous operations properly for blockchain transactions
- Test frontend-contract integration thoroughly

## Development Workflow

1. Write/modify smart contract code
2. Run `clarinet check` to verify syntax
3. Write tests for the contract
4. Run tests to verify functionality
5. Implement frontend changes
6. Test frontend integration manually

## Documentation Requirements

- Add descriptive comments to all major functions
- Document any non-obvious implementation details, assumptions, or limitations
- Keep the README.md updated with any workflow changes or important notes

## Dependencies

- Do not add additional dependencies without explicit instruction
- Maintain the exact versions specified in package.json
- Manage dependency versions carefully to avoid conflicts, especially with Stacks.js and the Clarinet SDK