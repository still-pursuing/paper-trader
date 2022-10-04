import { Router } from "express";

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
		const user = res.locals.user;
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
})