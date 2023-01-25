import { Router } from 'express';
import { DateTime } from 'luxon';

import { Transaction } from '../models/transactions';
import { HOME_ACTIVITY_LIMIT } from '../config';

export const router = Router();

/** GET / => { [ {ticker, quantity, price, type, from}, {...}, ...] }
 *
 * Returns an array of objects representing transaction information, where the
 * length of array is set by the configuration file value.
 *
 * Otherwise, returns an error.
 */

router.get('/', async (req, res, next) => {
  try {
    const databaseActivity = await Transaction.allRecentActivity(
      HOME_ACTIVITY_LIMIT
    );

    const activity = databaseActivity.map((entry) => {
      entry.price = (+entry.price).toLocaleString('en', {
        style: 'currency',
        currency: 'USD',
      });
      entry.transactionType = entry.type;

      const transactionDateMillis = new Date(entry.created_at).valueOf();
      entry.from = DateTime.fromMillis(transactionDateMillis).toRelative();

      delete entry.type;
      delete entry.created_at;

      return entry;
    });

    return res.json(activity);
  } catch (err) {
    return next(err);
  }
});
