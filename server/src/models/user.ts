import { db } from "../db";
import { INITIAL_FUNDS } from "../config";

export class User {
  static async loginOrRegister(id: string, username: string): Promise<string> {
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
      this.register(id, username, INITIAL_FUNDS, false);
    }
  }

  static async register(id: string, username: string, balance: number, is_admin: boolean): Promise<string> {

    const result = await db.query(
      `INSERT INTO users
        ( id,
          username,
          balance,
          is_admin )
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
      [id, username, balance, is_admin]
    )

    const user = result.rows[0];
    return user;
  }

  static async getProfile(id: string): Promise<string> {
    const result = await db.query(
      `SELECT username, balance
        FROM users
        WHERE id=$1`,
      [id]
    );
    const balance = result.rows[0];
    return balance;
  }


  // todo: add an update method if user changed their Discord username
}