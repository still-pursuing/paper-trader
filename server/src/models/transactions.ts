import { db } from '../db';

export class Transaction {
  static async buyTransction(
    ticker: string,
    quantity: number,
    price: number,
    user: string
  ) {
    const result = await db.query(
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

    const transaction = result.rows[0];
    return transaction;
  }
}
