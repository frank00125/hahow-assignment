import { Request, Response } from 'express';
import heroProfile from '../services/api/heroProfile';
import listHeroes from '../services/api/listHeroes';
import { ErrorCode, Hero } from '../types';

export default async (req: Request, res: Response) => {
	// get authentication result
	const { isAuthenticated = false } = res.locals;

	// get heroes
	let heroes: Hero[];
	try {
		const heroesResponse = await listHeroes();
		heroes = heroesResponse.heroes;
	} catch (error: any) {
		const {
			code = ErrorCode.INTERNAL_SERVER_ERROR,
			info = 'Internal Server Error',
		} = JSON.parse(error?.message || '{}');

		let statusCode: number = 500;
		switch (code) {
			case ErrorCode.SERVICE_UNAVAILABLE:
				statusCode = 503;
				break;
		}

		res.status(statusCode).json({
			errorCode: code,
			info: info,
		});
		return;
	}

	// authenticated => get profile for each hero
	if (isAuthenticated) {
		const heroProfilesResponse = await Promise.allSettled(
			heroes.map(({ id }) => heroProfile(id))
		);

		heroes.map((hero, index) => {
			const profileResponse = heroProfilesResponse[index];
			const profile =
				profileResponse.status === 'fulfilled' ? profileResponse.value : null;

			heroes[index] = {
				...hero,
				profile: profile || undefined,
			};
		});
	}

	// set response
	res.status(200).json({ heroes });
};
