import { Router } from 'express';
import { BadRequestError } from '../errors';

import { Finnhub } from '../api/finnhub';

export const router = Router();

/** GET /search => { stock }
 *
 * Returns stock quote information if a valid ticker is provided.
 * Otherwise, returns BadRequestError.
 *
 */
router.get('/search', async (req, res, next) => {
  const { ticker } = req.query;

  if (!ticker) return next(new BadRequestError("Missing ticker"));

  try {
    const quote = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (quote.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    return res.json(quote);
  } catch (err) {
    return next(err);
  }
})

/** POST /buy { ticker, quantity } => { price, qty, total }
 *
 * Returns stock price, quantity bought, and total cost if valid ticker and quantity is provided
 * Otherwise, returns BadRequestError.
 *
 */
router.post('/buy', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  if (!ticker) return next(new BadRequestError("Missing ticker"));

  try {
    const quote = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (quote.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    const price: number = quote.c;
    const total = Number((price * qty).toFixed(2));

    return res.json({ price, qty, total });
  } catch (err) {
    return next(err);
  }
})

/** POST /sell { ticker, quantity } => { price, qty, total }
 *
 * Returns stock price and quantity sold if valid ticker and quantity is provided
 * Otherwise, returns BadRequestError.
 *
 */
router.post('/sell', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  if (!ticker) return next(new BadRequestError("Missing ticker"));

  try {
    const quote = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (quote.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    const price: number = quote.c;

    return res.json({ price, qty });
  } catch (err) {
    return next(err);
  }
})