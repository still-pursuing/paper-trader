import { Router } from 'express';
import { BadRequestError } from '../errors';
import { Transaction } from '../models/transactions';
import { User } from '../models/user';
import { validateTicker } from '../middleware/validateTicker';

export const router = Router();

/** GET /search => { stock }
 *
 * Returns stock quote information from a valid ticker.
 *
 */
router.get('/search', validateTicker, async (req, res, next) => {
  const quote = res.locals.quote;
  return res.json({ quote });
});

/** POST /buy { ticker, quantity } => { price, qty, total }
 *
 * Returns stock price, quantity bought, and total cost if valid ticker and quantity is provided
 * Otherwise, returns an error.
 *
 */
router.post('/buy', validateTicker, async (req, res, next) => {
  const { ticker, quantity } = req.body;
  console.log(req.body);
  const quote = res.locals.quote;
  const qty = Number(quantity);

  try {
    const price: number = quote.c;
    const total = Number((price * qty).toFixed(2));

    const userBalance = +(await User.getProfile(res.locals.user)).balance;

    if (userBalance < total) {
      throw new BadRequestError(
        `Insufficient Funds: Transaction total of ${total.toLocaleString('en', {
          style: 'currency',
          currency: 'USD',
        })} exceeds account balance of ${userBalance.toLocaleString('en', {
          style: 'currency',
          currency: 'USD',
        })}`
      );
    }

    const remainingBalance = Number(
      await Transaction.buy(ticker, qty, price, res.locals.user)
    );

    return res.json({ price, qty, total, remainingBalance });
  } catch (err) {
    return next(err);
  }
});

/** POST /sell { ticker, quantity } => { price, qty, total }
 *
 * Returns stock price and quantity sold if valid ticker and quantity is provided.
 *
 */
router.post('/sell', async (req, res, next) => {
  const { quantity } = req.body;
  const qty = Number(quantity);
  const quote = res.locals.quote;

  // TODO: need to implement a check to see if qty exceeds owned shares

  const price: number = -quote.c;
  const total = Number((price * qty).toFixed(2));

  return res.json({ price, qty, total });
});
