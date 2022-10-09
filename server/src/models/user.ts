import { db } from "../db";

import { UnauthorizedError } from "../errors";

export class User {
  static async getUser(username: string) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
              balance,
              is_admin AS "isAdmin"
        FROM users
        WHERE username=$1`,
      [username]
    );

    const user = result.rows[0];
    console.log('user model', user)
    if (user) {
      return user;
    } else {
      return this.register(username, 10000, false);
    }
  }

  static async register(username: string, balance: number, is_admin: boolean) {
    const result = await db.query(
      `INSERT INTO users
        ( username,
          balance,
          is_admin )
        VALUES ($1, $2, $3)
        RETURNING username, balance, is_admin AS isAdmin`,
      [username, balance, is_admin]
    )

    const user = result.rows[0];
    return user;
  }


}