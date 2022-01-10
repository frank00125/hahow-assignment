import { AxiosError } from 'axios';
import { HeroProfile } from '../../types';
import hahowApiInstance from './apiInstance';

export default async (heroId: string): Promise<HeroProfile | null> => {
	let heroProfile: HeroProfile | null = null;
	try {
		const response = await hahowApiInstance.get<HeroProfile>(
			`/heroes/${heroId}/profile`,
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application',
				},
			}
		);
		heroProfile = response.data;
	} catch (error) {
		// check if the error is from Axios
		const axiosError = error as AxiosError;
		if (!axiosError?.isAxiosError) {
			throw error;
		}

		console.error('[ERROR] Hahow API Calling Error ', error);
	}

	return heroProfile;
};
