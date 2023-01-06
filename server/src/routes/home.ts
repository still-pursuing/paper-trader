import { Router } from 'express';
import { Transaction } from '../models/transactions';

export const router = Router();

const ACTIVITY_LIMIT = 10;

/** GET / => {  }
 *
 * Returns
 *
 */

router.get('/', async (req, res, next) => {
  try {
    const databaseActivity = await Transaction.allRecentActivity(
      ACTIVITY_LIMIT
    );

    const activity = databaseActivity.map((entry) => {
      entry.transactionType = entry.type;
      entry.from = entry.created_at;
      delete entry.type;
      delete entry.created_at;
      return entry;
    });

    return res.json(activity);
  } catch (err) {
    return next(err);
  }
});
