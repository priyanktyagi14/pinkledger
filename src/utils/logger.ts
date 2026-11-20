/**
 * PinkLedger Safe Logging Utility
 * Ensures that no transaction amounts, financial balances, or sensitive user data
 * are ever logged to the browser console in production.
 */

const isProd = typeof process !== 'undefined' 
  ? process.env.NODE_ENV === 'production' 
  : (import.meta as any).env?.PROD ?? false;

export const safeLog = {
  info: (message: string, ..._args: unknown[]) => {
    if (!isProd) {
      console.info(`[PinkLedger] ${message}`);
    }
  },
  warn: (message: string, ..._args: unknown[]) => {
    if (!isProd) {
      console.warn(`[PinkLedger] ${message}`);
    }
  },
  error: (message: string, error?: unknown) => {
    // Only log the error name / message, never financial payloads
    if (!isProd) {
      console.error(`[PinkLedger] ${message}`, error);
    } else {
      const errName = error instanceof Error ? error.name : 'UnknownError';
      console.error(`[PinkLedger] ${message} (${errName})`);
    }
  },
};
