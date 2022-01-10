import { AxiosError } from 'axios';
import hahowApiInstance from './apiInstance';

type AuthenticateApiInput = {
	name: string;
	password: string;
};

export default async ({
	name,
	password,
}: AuthenticateApiInput): Promise<{
	authenticateStatus: boolean;
}> => {
	let authenticateStatus: boolean = false;
	try {
		await hahowApiInstance.post(
			'/auth',
			{
				name,
				password,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		authenticateStatus = true;
	} catch (error: any) {
		// check if the error is from Axios
		const axiosError = error as AxiosError;
		if (!axiosError?.isAxiosError) {
			throw error;
		}

		console.error('[ERROR] Hahow API Calling Error ', error);
	}

	return {
		authenticateStatus,
	};
};
