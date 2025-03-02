import { randomBytes } from 'crypto';

/**
 * Generates a random token string of specified length
 * @param length The desired length of the token in characters (default: 32)
 * @returns A random hex string of the specified length
 */
export const generateToken = (length: number = 32): string => {
  return randomBytes(length / 2).toString('hex');
};
