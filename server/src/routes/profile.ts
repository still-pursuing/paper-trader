import { Router } from "express";
import { User } from "../models/user";

export const router = Router();

/** GET / => { user }
 *
 * Returns user's username
 *
 */

router.get('/', async (req, res, next) => {
	try {
		const userPortfilio = await User.getProfile(res.locals.user);
		return res.json({ userPortfilio });
	} catch (err) {
		return next(err);
	}
})
