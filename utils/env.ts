import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill in your noon test account.`);
  }
  return value;
}

// Getters so a missing .env only fails the tests that actually sign in.
export const credentials = {
  get email() {
    return requireEnv('NOON_EMAIL');
  },
  get password() {
    return requireEnv('NOON_PASSWORD');
  },
};
