import { Router } from "express";
import { User } from "../models/user";

import { ensureCorrectUser } from '../middleware/auth';

export const router = Router();

/** GET / => { user }
 *
 * Returns user's username
 *
 * Authorization required: ensureCorrectUser
 */

router.get('/', ensureCorrectUser, async (req, res, next) => {
	try {
		// query database for user's data in the future?
		const user = await User.getUser(res.locals.user);
		console.log('Profile', user);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
})