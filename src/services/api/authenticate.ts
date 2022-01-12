import axios from 'axios';
import { ErrorCode } from '../../types';
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
		console.error('[ERROR] Hahow API Calling Error at Authenticate API', error);
	}

	return {
		authenticateStatus,
	};
};
