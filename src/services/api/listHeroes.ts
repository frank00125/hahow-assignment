import { AxiosError } from 'axios';
import { Hero } from '../../types';
import hahowApiInstance from './apiInstance';

export default async (): Promise<{
	heroes: Hero[];
}> => {
	let heroes: Hero[] = [];
	try {
		const response = await hahowApiInstance.get<Hero[]>('/heroes', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application',
			},
		});
		heroes = response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		if (!axiosError?.isAxiosError) {
			throw error;
		}

		console.error('[ERROR] Hahow API Calling Error ', error);
	}

	return { heroes: Array.isArray(heroes) ? heroes : [] };
};
