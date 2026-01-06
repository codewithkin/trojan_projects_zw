/**
 * Password hashing utilities using Bun's built-in password hashing
 * Uses bcrypt algorithm for secure password storage
 */

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10, // Work factor - higher is more secure but slower
  });
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}
