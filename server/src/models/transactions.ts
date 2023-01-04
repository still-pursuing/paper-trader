import { BadRequestError } from '../errors';
import { db } from '../db';

export class Transaction {
  /** Reduce user's cash balance and record stock purchase details
   *
   * Accepts ticker, quantity, price, and user
   * Returns balance from database
   */
  static async buy(
    ticker: string,
    quantity: number,
    price: number,
    user: string
  ) {
    const balanceResult = db.query(
      `UPDATE users
      SET balance = (SELECT (balance - (CAST($1 as numeric) * CAST($2 as numeric))) FROM users WHERE id = $3)
      WHERE id = $3
      RETURNING balance`,
      [price, quantity, user]
    );

    const transactionResult = db.query(
      `INSERT INTO transactions
        ( ticker,
          quantity,
          price,
          user_id,
          type
        )
        VALUES ($1, $2, $3, $4, 'buy')
        RETURNING id`,
      [ticker, quantity, price, user]
    );

    const results = [await balanceResult, await transactionResult];

    const { balance } = results[0].rows[0];
    return balance;
  }

  /** Check the total number of shares owned by a user for a provided ticker
   *
   * Accepts ticker and user
   * Returns total from database
   */
  static async checkQuantity(ticker: string, user: string) {
    const totalResult = await db.query(
      `SELECT (SELECT COALESCE((SELECT SUM(quantity)
                FROM transactions
                WHERE user_id = $1 AND ticker = $2 AND type = 'buy'), 0) - 
              (SELECT COALESCE((SELECT SUM(quantity)
                FROM transactions
                WHERE user_id = $1 AND ticker = $2 AND type = 'sell'), 0))) as total`,
      [user, ticker]
    );

    let { total } = totalResult.rows[0];

    return total;
  }

  /** Increase user's cash balance and record stock sell details
   *
   * Accepts ticker, quantity, price, and user
   * Returns balance from database
   */
  static async sell(
    ticker: string,
    quantity: number,
    price: number,
    user: string
  ) {
    const balanceResult = db.query(
      `UPDATE users
      SET balance = (SELECT (balance + (CAST($1 as numeric) * CAST($2 as numeric))) FROM users WHERE id = $3)
      WHERE id = $3
      RETURNING balance`,
      [price, quantity, user]
    );

    const transactionResult = db.query(
      `INSERT INTO transactions
        ( ticker,
          quantity,
          price,
          user_id,
          type
        )
        VALUES ($1, $2, $3, $4, 'sell')
        RETURNING id`,
      [ticker, quantity, price, user]
    );

    const results = [await balanceResult, await transactionResult];

    const { balance } = results[0].rows[0];

    return balance;
  }
}
