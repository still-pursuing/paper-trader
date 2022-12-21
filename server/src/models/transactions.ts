import { db } from '../db';

export class Transaction {
  /** Reduce user's cash balance and record stock purchase details */
  static async buy(
    ticker: string,
    quantity: number,
    price: number,
    user: string
  ) {
    const balanceResult = await db.query(
      `UPDATE users
      SET balance = (SELECT (balance - (CAST($1 as numeric) * CAST($2 as numeric))) FROM users WHERE id = $3)
      WHERE id = $3
      RETURNING balance`,
      [price, quantity, user]
    );

    await db.query(
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

    const { balance } = balanceResult.rows[0];
    return balance;
  }
}
