import { Router } from 'express';

import { Transaction } from '../models/transactions';
import { timeDifference } from '../helpers/relativeTime';
import { HOME_ACTIVITY_LIMIT } from '../config';

export const router = Router();

/** GET / => {  }
 *
 * Returns
 *
 */

router.get('/', async (req, res, next) => {
  try {
    const databaseActivity = await Transaction.allRecentActivity(
      HOME_ACTIVITY_LIMIT
    );

    const activity = databaseActivity.map((entry) => {
      entry.transactionType = entry.type;

      entry.from = timeDifference(
        Date.now(),
        new Date(entry.created_at).valueOf()
      );
      delete entry.type;
      delete entry.created_at;

      return entry;
    });

    return res.json(activity);
  } catch (err) {
    return next(err);
  }
});
