import { db } from "../db";
import { INITIAL_FUNDS } from "../config";

type Profile = {
  username: string
  balance: string
}

type UserId = {
  id: string
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
      this.register(id, username, INITIAL_FUNDS, false);
    }
  }

  static async register(id: string, username: string, balance: number, is_admin: boolean): Promise<UserId> {

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
}