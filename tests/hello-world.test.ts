import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

// Add these type declarations
declare global {
  var simnet: {
    getAccounts: () => Map<string, string>;
    callPublicFn: (contract: string, method: string, args: any[], sender: string) => { result: any };
    callReadOnlyFn: (contract: string, method: string, args: any[], sender: string) => { result: any };
  };
}

// Extend expect interface for custom matchers
declare module 'vitest' {
  interface Assertion<T> {
    toBeOk: (expected?: any) => void;
    toBeErr: (expected?: any) => void;
    toBeUtf8: (expected: string) => void;
  }
}

describe('hello-world', () => {
  let wallet1: string;
  
  beforeEach(() => {
    const accounts = simnet.getAccounts();
    wallet1 = accounts.get('wallet_1')!;
  });

  it('returns a greeting from read-only function', () => {
    // Call the read-only greet function
    const { result } = simnet.callReadOnlyFn(
      'hello-world-c43fe8da',
      'greet',
      [],
      wallet1
    );
    
    // Assert function returns expected greeting
    expect(result).toBeOk();
    expect(result.value).toBeUtf8("Hello, Stacks World!");
  });

  it('returns a personalized greeting with name parameter', () => {
    // Call the public function with a name
    const { result } = simnet.callPublicFn(
      'hello-world-c43fe8da',
      'greet-name',
      [Cl.stringUtf8("Tester")],
      wallet1
    );
    
    // Assert function returns expected personalized greeting
    expect(result).toBeOk();
    expect(result.value).toBeUtf8("Hello, Tester!");
  });
});