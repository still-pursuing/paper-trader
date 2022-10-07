import { Router } from 'express';
import { BadRequestError } from '../src/errors';

import { Finnhub } from '../api/finnhub';
import { ensureCorrectUser } from '../middleware/auth';


export const router = Router();

router.get('/search', async (req, res, next) => {
  const { ticker } = req.query;

  if (!ticker) return next(new BadRequestError());

  try {
    const stock = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (stock.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    return res.json(stock);
  } catch (err) {
    return next(err);
  }
})

router.post('/buy', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  if (!ticker) return next(new BadRequestError());

  try {
    const stock = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (stock.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    const price: number = stock.c;
    const total = Number((price * qty).toFixed(2));

    return res.json({ price, qty, total });
  } catch (err) {
    return next(err);
  }
})

router.post('/sell', async (req, res, next) => {
  const { ticker, quantity } = req.body;
  const qty = Number(quantity);

  if (!ticker) return next(new BadRequestError());

  try {
    const stock = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (stock.c === 0) {
      throw new BadRequestError("Invalid Stock Ticker");
    }

    const price: number = stock.c;

    return res.json({ price, qty });
  } catch (err) {
    return next(err);
  }
})