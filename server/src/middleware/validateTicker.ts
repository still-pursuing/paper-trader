import express from 'express';

import { BadRequestError } from '../errors';
import { StockTransactionAPI } from '../api/stockTransactionAPI';

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

    const sharePrice = await StockTransactionAPI.getStockQuote(
      ticker.toString().toUpperCase()
    );

    if (sharePrice === 0) {
      throw new BadRequestError('Invalid Stock Ticker');
    }

    res.locals.sharePrice = sharePrice;
    return next();
  } catch (error) {
    return next(error);
  }
}
