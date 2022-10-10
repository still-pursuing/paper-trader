import { db } from "../db";

import { BadRequestError } from "../errors";

export class User {
  // get only the username?
  static async login(username: string) {
    // try to find the user first
    const result = await db.query(
      `SELECT username
        FROM users
        WHERE username=$1`,
      [username]
    );

    const user = result.rows[0];

    if (user) return user;

    throw new BadRequestError("No account found, please register");
  }

  static async register(username: string, balance: number, is_admin: boolean) {

    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const result = await db.query(
      `INSERT INTO users
        ( username,
          balance,
          is_admin )
        VALUES ($1, $2, $3)
        RETURNING username`,
      [username, balance, is_admin]
    )

    const user = result.rows[0];
    return user;
  }

  static async getBalance(username: string) {
    const result = await db.query(
      `SELECT balance
        FROM users
        WHERE username=$1`,
      [username]
    );

    const balance = result.rows[0];
    return balance;
  }

}