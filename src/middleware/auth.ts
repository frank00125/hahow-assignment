import { NextFunction, Request, Response } from 'express';
import authenticate from '../services/api/authenticate';

export default async (req: Request, res: Response, next: NextFunction) => {
	// get info that authorize action needs
	const name = req.header('Name');
	const password = req.header('Password');
	if (!name || !password) {
		res.locals.isAuthenticated = false;
		next();
		return;
	}

	// check if the user is authenticated
	const { authenticateStatus } = await authenticate({
		name,
		password,
	});

	// pass authentication result
	res.locals.isAuthenticated = authenticateStatus;
	next();
};
