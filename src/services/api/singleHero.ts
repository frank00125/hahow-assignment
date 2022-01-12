import axios from 'axios';
import { ErrorCode, Hero } from '../../types';
import hahowApiInstance from './apiInstance';

export default async (heroId: string): Promise<Hero | null> => {
	let hero: Hero | null = null;
	try {
		const response = await hahowApiInstance.get<Hero>(`/heroes/${heroId}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application',
			},
		});
		hero = response.data;
	} catch (error) {
		// check if the error is from Axios
		console.error('[ERROR] Hahow API Calling Error at Single Hero API', error);
		throw new Error(
			axios.isAxiosError(error)
				? JSON.stringify({
						code: ErrorCode.SERVICE_UNAVAILABLE,
						info: error,
				  })
				: ''
		);
	}

	// check if the hero info with given id is ok to use
	if (!hero?.id) {
		throw new Error(JSON.stringify(hero));
	}

	return hero;
};
