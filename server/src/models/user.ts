import { db } from '../db';
import { INITIAL_FUNDS } from '../config';

interface Profile {
  username: string;
  balance: string;
}

interface UserId {
  id: string;
}

export class User {
  static async loginOrRegister(id: string, username: string): Promise<UserId> {
    const result = await db.query(
      `SELECT id
        FROM users
        WHERE id=$1`,
      [id]
    );

    const user = result.rows[0];

    if (user) {
      return user;
    } else {
      return this.register(id, username, INITIAL_FUNDS, false);
    }
  }

  static async register(
    id: string,
    username: string,
    balance: number,
    isAdmin: boolean
  ): Promise<UserId> {
    const result = await db.query(
      `INSERT INTO users
        ( id,
          username,
          balance,
          is_admin )
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
      [id, username, balance, isAdmin]
    );

    const user = result.rows[0];
    return user;
  }

  /** Query the database for user's profile
   *
   * Returns either their profile or undefined if there's no entry
   */
  static async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.query(
      `SELECT username, balance
        FROM users
        WHERE id=$1`,
      [id]
    );
    const profile = result.rows[0];
    return profile;
  }

  // todo: add an update method if user changed their Discord username

  /** Query the database for user's portfolio holdings
   *
   * Returns either their holdings or undefined if there's no transactions
   */
  static async getHoldings(id: string) {
    const result = await db.query(
      `SELECT ticker, SUM(CASE WHEN type='buy' THEN quantity ELSE -quantity END)
        AS total_owned
        FROM transactions
        WHERE user_id=$1
        GROUP BY ticker`,
      [id]
    );

    const holdings = result.rows;
    return holdings;
  }
}
