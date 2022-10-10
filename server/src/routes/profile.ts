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

router.get('/username', ensureCorrectUser, async (req, res, next) => {
	try {
		// query database for user's data in the future?
		const user = await User.login(res.locals.user);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
})

router.get('/summary', ensureCorrectUser, async (req, res, next) => {
	try {
		// query database for user's data in the future?
		const balance = await User.getBalance(res.locals.user);
		return res.json({ balance });
	} catch (err) {
		return next(err);
	}
})