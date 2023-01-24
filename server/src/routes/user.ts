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
    const userPortfolio = await User.getPortfolioValue(res.locals.user);

    for (const stock of userPortfolio) {
      const { ticker, total_owned }: { ticker: string; total_owned: string } =
        stock;
      const { longName, regularMarketPrice } = await yahooFinance.quote(ticker); // argument must be type string
      stock.company = longName;
      stock.totalOwned = +total_owned;
      stock.currentPrice = regularMarketPrice;
      stock.totalValue = +(stock.totalOwned * regularMarketPrice).toFixed(2);
      delete stock.total_owned;
    }

    return res.json({ userProfile, userPortfolio });
  } catch (err) {
    return next(err);
  }
});
