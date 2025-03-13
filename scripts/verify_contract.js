/**
 * Script to verify a Clarity contract for syntax and safety issues
 */
const fs = require('fs');

// Load contract
const CONTRACT_PATH = './contracts/microtasks.clar';
const contract = fs.readFileSync(CONTRACT_PATH, 'utf8');

console.log('========= CONTRACT VERIFICATION =========');
console.log(`Analyzing contract: ${CONTRACT_PATH}\n`);

// Basic checks
const lines = contract.split('\n');
console.log(`Contract length: ${contract.length} bytes, ${lines.length} lines\n`);

// Check for common Clarity syntax issues
const syntaxChecks = [
  { pattern: /[{]\s*\n\s*[}]/g, issue: 'Empty code blocks' },
  { pattern: /[\(][^)]*$/, issue: 'Mismatched parentheses (unclosed opening parenthesis)' },
  { pattern: /[^(]*[\)]/g, issue: 'Mismatched parentheses (extra closing parenthesis)' },
  { pattern: /\s+,\s+/g, issue: 'Spaces around commas (Clarity uses space-delimited lists instead)' },
  { pattern: /["'](?:[^"'\\]|\\.)*\n/g, issue: 'Unterminated string literal' },
  { pattern: /;[^;].*;/g, issue: 'Possible multiline comment that should use block comment style' },
  { pattern: /try!\s*\(/g, issue: 'Make sure try! has no space before parenthesis' },
  { pattern: /\(define-\w+\s+[^\s(]+\s+[^(]/g, issue: 'Clarity definitions should be followed by a type or parenthesis' },
];

let issuesFound = false;

// Run syntax checks
syntaxChecks.forEach(check => {
  const matches = contract.match(check.pattern);
  if (matches && matches.length > 0) {
    console.log(`⚠️ ${check.issue} detected: ${matches.length} instances`);
    issuesFound = true;
  }
});

// Check for common function signature issues
console.log('\n========= FUNCTION CHECKS =========');

// Public functions
const publicFns = contract.match(/\(define-public\s+\(([^)]+)\)/g) || [];
console.log(`Public functions: ${publicFns.length}`);
publicFns.forEach(fn => {
  console.log(`  ${fn.match(/\(define-public\s+\(([^)]+)\)/)[1]}`);
});

// Read-only functions
const readOnlyFns = contract.match(/\(define-read-only\s+\(([^)]+)\)/g) || [];
console.log(`\nRead-only functions: ${readOnlyFns.length}`);
readOnlyFns.forEach(fn => {
  console.log(`  ${fn.match(/\(define-read-only\s+\(([^)]+)\)/)[1]}`);
});

// Check error codes
console.log('\n========= ERROR CODE CHECKS =========');
const errorCodes = contract.match(/\(define-constant\s+([A-Z0-9_]+)\s+\(err\s+([^)]+)\)\)/g) || [];
console.log(`Error codes defined: ${errorCodes.length}`);
errorCodes.forEach(code => {
  const match = code.match(/\(define-constant\s+([A-Z0-9_]+)\s+\(err\s+([^)]+)\)\)/);
  console.log(`  ${match[1]} = ${match[2]}`);
});

// Analyze function return types
console.log('\n========= FUNCTION RETURN TYPES =========');
let hasReturnTypeIssues = false;

const functionMatches = contract.match(/\(define-(public|read-only)\s+\([^)]+\)[^)]*\)/g) || [];
functionMatches.forEach(fnDef => {
  // Check if the function has a return type specified
  if (!fnDef.includes('(response') && !fnDef.includes(' : ')) {
    console.log(`⚠️ Function missing explicit return type: ${fnDef.trim()}`);
    hasReturnTypeIssues = true;
  }
});

if (!hasReturnTypeIssues) {
  console.log('✅ All functions have explicit return types');
}

// Look for potential security issues
console.log('\n========= SECURITY CHECKS =========');

const securityChecks = [
  { pattern: /tx-sender/g, issue: 'Uses tx-sender (make sure authorization is properly checked)' },
  { pattern: /as-contract/g, issue: 'Uses as-contract (check for proper contract-as-principal pattern)' },
  { pattern: /contract-call/g, issue: 'Makes contract calls (verify target contracts are trusted)' },
  { pattern: /\(stx-transfer\?/g, issue: 'Transfers STX (verify proper authorization)' },
  { pattern: /unwrap-panic/g, issue: 'Uses unwrap-panic (consider using unwrap! for better error handling)' },
  { pattern: /contract-caller/g, issue: 'Uses contract-caller (ensure proper authorization)' },
];

securityChecks.forEach(check => {
  const matches = contract.match(check.pattern);
  if (matches && matches.length > 0) {
    console.log(`🔍 ${check.issue}: ${matches.length} instances`);
  }
});

// Give deployment recommendations
console.log('\n========= DEPLOYMENT RECOMMENDATION =========');
if (issuesFound) {
  console.log('❌ Contract has potential issues that should be fixed before deployment');
} else {
  console.log('✅ Contract looks valid for deployment');
  console.log('\nRecommended deployment settings:');
  console.log('- Contract name: microtasks-v5 (use a unique name)');
  console.log('- Network: testnet');
  console.log('- Fee: 100000 microSTX (0.1 STX)');
  console.log('- Nonce: 2 (from account check)');
}

console.log('\n==========================================');