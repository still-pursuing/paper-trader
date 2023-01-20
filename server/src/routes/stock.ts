import { Router } from 'express';
import { BadRequestError } from '../errors';
import { Transaction } from '../models/transactions';
import { User } from '../models/user';

export const router = Router();

/** GET /search => { stock }
 *
 * Returns stock quote information from a valid ticker.
 *
 */
router.get('/search', async (req, res, next) => {
  const price: number = res.locals.sharePrice;
  return res.json({ price });
});

/** POST /buy {  quantity } => { price, qty, total }
 *
 * Returns stock price, quantity bought, and total cost if valid ticker and
 * valid quantity is provided.
 *
 * Otherwise, returns an error.
 */
router.post('/buy', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  try {
    const price: number = res.locals.sharePrice;
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

    const balance = Number(
      await Transaction.buy(ticker, qty, price, res.locals.user)
    );

    return res.json({ price, qty, total, balance });
  } catch (err) {
    return next(err);
  }
});

/** POST /sell { quantity } => { price, qty, total }
 *
 * Returns stock price and quantity sold if valid ticker and
 * valid quantity is provided.
 *
 * Otherwise, returns an error.
 */
router.post('/sell', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  try {
    const totalOwned = Number(
      await Transaction.checkQuantity(ticker, res.locals.user)
    );

    if (totalOwned < qty) {
      throw new BadRequestError(
        `Sell volume of ${qty} ${ticker} shares exceeds total owned ${ticker} shares of ${totalOwned}.`
      );
    }

    const price: number = res.locals.sharePrice;
    const total = Number((price * qty).toFixed(2));

    const balance = Number(
      await Transaction.sell(ticker, qty, price, res.locals.user)
    );

    return res.json({ price, qty, total, balance });
  } catch (error) {
    return next(error);
  }
});
