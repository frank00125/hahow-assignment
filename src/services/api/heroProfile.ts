import axios from 'axios';
import { ErrorCode, HeroProfile } from '../../types';
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
		console.error('[ERROR] Hahow API Calling Error at Hero Profile API', error);

		throw new Error(
			axios.isAxiosError(error)
				? JSON.stringify({
						code: ErrorCode.SERVICE_UNAVAILABLE,
						info: error,
				  })
				: ''
		);
	}
	return heroProfile;
};
