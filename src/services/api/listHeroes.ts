import axios from 'axios';
import { ErrorCode, Hero } from '../../types';
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
		console.error('[ERROR] Hahow API Calling Error at List Heroes API', error);

		throw new Error(
			axios.isAxiosError(error)
				? JSON.stringify({
						code: ErrorCode.SERVICE_UNAVAILABLE,
						info: error,
				  })
				: ''
		);
	}

	return { heroes };
};
