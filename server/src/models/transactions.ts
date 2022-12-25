import { BadRequestError } from '../errors';
import { db } from '../db';

export class Transaction {
  /** Reduce user's cash balance and record stock purchase details */
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
          user_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
      [ticker, quantity, price, user]
    );

    const results = [await balanceResult, await transactionResult];

    const { balance } = results[0].rows[0];
    return balance;
  }

  static async checkQuantity(ticker: string, user: string) {
    const totalResult = await db.query(
      `SELECT sum(quantity) as total
        FROM transactions
        WHERE user_id = $1 AND ticker = $2`,
      [user, ticker]
    );

    let { total } = totalResult.rows[0];

    total = total === null ? 0 : total;

    return total;
  }

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
          user_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
      [ticker, -quantity, price, user]
    );

    const results = [await balanceResult, await transactionResult];

    const { balance } = results[0].rows[0];

    return balance;
  }
}
