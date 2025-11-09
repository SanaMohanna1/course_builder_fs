import db, { pgp } from './config/database.js';

export default async () => {
  try {
    if (db?.$pool?.end) {
      await db.$pool.end();
    }
  } catch (error) {
    console.error('Error closing db pool:', error);
  }

  try {
    pgp?.end?.();
  } catch (error) {
    console.error('Error closing pgp:', error);
  }
};
