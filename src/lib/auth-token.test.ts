import { describe, expect, it, beforeEach, afterAll, vi } from 'vitest';

const ORIGINAL_SECRET = process.env.SESSION_SECRET;

describe('auth-token', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.SESSION_SECRET = 'test-secret-value';
  });

  afterAll(() => {
    process.env.SESSION_SECRET = ORIGINAL_SECRET;
  });

  it('accepts a token it signed itself', async () => {
    const { createSessionToken, verifySessionToken } = await import('./auth-token');
    const token = createSessionToken(Date.now() + 60_000);
    expect(verifySessionToken(token)).toBe(true);
  });

  it('rejects an expired token', async () => {
    const { createSessionToken, verifySessionToken } = await import('./auth-token');
    const token = createSessionToken(Date.now() - 1);
    expect(verifySessionToken(token)).toBe(false);
  });

  it('rejects a tampered payload', async () => {
    const { createSessionToken, verifySessionToken } = await import('./auth-token');
    const token = createSessionToken(Date.now() + 60_000);
    const [, signature] = token.split('.');
    const tampered = `${Date.now() + 999_999}.${signature}`;
    expect(verifySessionToken(tampered)).toBe(false);
  });

  it('rejects a token signed with a different secret', async () => {
    const { createSessionToken } = await import('./auth-token');
    const token = createSessionToken(Date.now() + 60_000);

    vi.resetModules();
    process.env.SESSION_SECRET = 'a-different-secret';
    const { verifySessionToken } = await import('./auth-token');
    expect(verifySessionToken(token)).toBe(false);
  });

  it('rejects missing, empty, or malformed tokens', async () => {
    const { verifySessionToken } = await import('./auth-token');
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken(null)).toBe(false);
    expect(verifySessionToken('')).toBe(false);
    expect(verifySessionToken('not-a-valid-token')).toBe(false);
  });

  it('timingSafeEqualStrings matches equal strings and rejects unequal ones', async () => {
    const { timingSafeEqualStrings } = await import('./auth-token');
    expect(timingSafeEqualStrings('DigiHQ2026', 'DigiHQ2026')).toBe(true);
    expect(timingSafeEqualStrings('DigiHQ2026', 'wrongpass')).toBe(false);
    expect(timingSafeEqualStrings('', '')).toBe(true);
  });
});
