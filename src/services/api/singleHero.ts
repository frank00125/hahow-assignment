import { AxiosError } from 'axios';
import { Hero } from '../../types';
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
		const axiosError = error as AxiosError;
		if (!axiosError?.isAxiosError) {
			throw error;
		}

		console.error('[ERROR] Hahow API Calling Error ', error);
	}

	// check if the hero info with given id is ok to use
	if (!hero?.id) {
		throw new Error(JSON.stringify(hero));
	}

	return hero;
};
