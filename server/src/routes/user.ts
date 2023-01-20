import { Router } from 'express';
import { NotFoundError } from '../errors';
import { User } from '../models/user';

export const router = Router();

/** GET / => { user }
 *
 * Returns user's profile and portfolio
 *
 */

router.get('/', async (req, res, next) => {
  try {
    const userProfile = await User.getProfile(res.locals.user);
    if (userProfile === undefined) {
      throw new NotFoundError('No user found');
    }
    const userPortfolio = await User.getPortfolioValue(res.locals.user);

    return res.json({ userProfile, userPortfolio });
  } catch (err) {
    return next(err);
  }
});
