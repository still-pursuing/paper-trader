import express from 'express';

import { BadRequestError } from '../errors';
import { Finnhub } from '../api/finnhub';

/** Checks if a stock ticker is included in the request and if it's a valid
 * ticker on the NYSE (according to Finnhub)
 */
export async function validateTicker(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const ticker = req.query.ticker ?? req.body.ticker;

  try {
    if (!ticker) throw new BadRequestError('Missing Ticker');

    const quote = await Finnhub.getStockQuote(ticker.toString().toUpperCase());

    if (quote.c === 0) {
      throw new BadRequestError('Invalid Stock Ticker');
    }

    res.locals.quote = quote;
    return next();
  } catch (error) {
    return next(error);
  }
}
