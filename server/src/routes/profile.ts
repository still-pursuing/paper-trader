import { Router } from 'express';
import yahooFinance from 'yahoo-finance2';

import { NotFoundError } from '../errors';
import { User } from '../models/user';
import { convertToUSDCurrency } from '../helpers/dollarConverter';

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

    for (const stock of userHoldings) {
      const { ticker, total_owned }: { ticker: string; total_owned: string } =
        stock;
      const { longName, regularMarketPrice } = await yahooFinance.quote(ticker);
      stock.company = longName;
      stock.totalOwned = total_owned;
      stock.currentPrice = convertToUSDCurrency(regularMarketPrice);
      stock.totalValue = +total_owned * regularMarketPrice;

      delete stock.total_owned;
    }

    let totalHoldingsValue = userHoldings
      .map((holding) => holding.totalValue)
      .reduce((a, b) => a + b, 0);

    const totalUserValue = convertToUSDCurrency(
      +userProfile.balance + totalHoldingsValue
    );

    userProfile.balance = convertToUSDCurrency(+userProfile.balance);

    totalHoldingsValue = convertToUSDCurrency(totalHoldingsValue);

    userHoldings.map((holding) => {
      holding.totalValue = convertToUSDCurrency(holding.totalValue);
    });

    return res.json({
      userProfile,
      userHoldings,
      totalHoldingsValue,
      totalUserValue,
    });
  } catch (err) {
    return next(err);
  }
});
