import { Request, Response } from 'express';
import heroProfile from '../services/api/heroProfile';
import listHeroes from '../services/api/listHeroes';

export default async (req: Request, res: Response) => {
	// get authentication result
	const { isAuthenticated = false } = res.locals;

	// get heroes
	const { heroes = [] } = await listHeroes();

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
