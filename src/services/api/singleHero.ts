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
		const axiosError = error as AxiosError;
		if (!axiosError?.isAxiosError) {
			throw error;
		}

		console.error('[ERROR] Hahow API Calling Error ', error);
	}

	if (!hero?.id) {
		throw new Error(JSON.stringify(hero));
	}

	return hero;
};
