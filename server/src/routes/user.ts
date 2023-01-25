import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

import { NotFoundError } from '../errors';
import { User } from '../models/user';

export const router = Router();

/** GET / => { user }
 *
 * Returns user's profile and portfolio
 *
 */

router.get('/', async (req, res, next) => {
  try {
    const userProfile = await User.getProfile(res.locals.user);
    if (userProfile === undefined) {
      throw new NotFoundError('No user found');
    }
    const userHoldings = await User.getHoldings(res.locals.user);

    // use array.map instead?
    for (const stock of userHoldings) {
      const { ticker, total_owned }: { ticker: string; total_owned: string } =
        stock;
      const { longName, regularMarketPrice } = await yahooFinance.quote(ticker); // argument must be type string
      stock.company = longName;
      stock.totalOwned = total_owned;
      stock.currentPrice = regularMarketPrice.toLocaleString('en', {
        style: 'currency',
        currency: 'USD',
      });
      stock.totalValue = +(+total_owned * regularMarketPrice);

      delete stock.total_owned;
    }

    userHoldings.push({
      company: 'Total',
      ticker: '',
      totalOwned: '',
      currentPrice: '',
      totalValue: userHoldings
        .map((holding) => holding.totalValue)
        .reduce((a, b) => a + b, 0),
    });

    userHoldings.map((holding) => {
      holding.totalValue = holding.totalValue.toLocaleString('en', {
        style: 'currency',
        currency: 'USD',
      });
    });

    return res.json({ userProfile, userHoldings });
  } catch (err) {
    return next(err);
  }
});
