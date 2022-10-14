import { Router } from "express";
import { BadRequestError } from "../errors";
import { User } from "../models/user";

export const router = Router();

/** GET / => { user }
 *
 * Returns user's username
 *
 */

router.get('/', async (req, res, next) => {
  try {
    const userPortfolio = await User.getProfile(res.locals.user);
    if (userPortfolio === undefined) {
      throw new BadRequestError("No user found")
    }
    return res.json({ userPortfolio });
  } catch (err) {
    return next(err);
  }
})
