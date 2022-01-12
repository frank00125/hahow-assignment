import { Request, Response } from 'express';
import heroProfile from '../services/api/heroProfile';
import singleHero from '../services/api/singleHero';
import { ErrorCode } from '../types';

export default async (req: Request, res: Response) => {
	// get authentication result
	const { isAuthenticated = false } = res.locals;

	// check request
	const { heroId } = req.params;
	if (!heroId) {
		res.status(400).json({
			errorCode: ErrorCode.INVALID_FIELDS,
			message: 'Invalid Fields: heroId',
		});
		return;
	}

	// get hero and hero profile
	const [heroResponse, heroProfileResponse = null] = await Promise.allSettled(
		isAuthenticated
			? [singleHero(heroId), heroProfile(heroId)]
			: [singleHero(heroId)]
	);
	if (
		heroResponse.status === 'rejected' ||
		(isAuthenticated && heroProfileResponse?.status === 'rejected')
	) {
		res.status(503).json({
			errorCode: ErrorCode.SERVICE_UNAVAILABLE,
			message: 'Service Unavailable',
			error: {
				hero: heroResponse.status === 'rejected' && heroResponse.reason,
				profile:
					heroProfileResponse?.status === 'rejected' &&
					heroProfileResponse.reason,
			},
		});
		return;
	}
	const hero = heroResponse.status === 'fulfilled' ? heroResponse.value : null;
	const profile =
		heroProfileResponse?.status === 'fulfilled'
			? heroProfileResponse.value
			: null;

	// check if the hero and its profile exists
	if (!hero || (isAuthenticated && !profile)) {
		res.status(404).json({
			errorCode: ErrorCode.NO_SUCH_HERO,
			message: 'No Such Hero',
		});
		return;
	}

	// set response
	res.status(200).json({
		...hero,
		profile: profile || undefined,
	});
};
