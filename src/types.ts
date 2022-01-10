export enum ErrorCode {
	INVALID_FIELDS = 'HAHOW_ASSIGNMENT_ERR_INVALID_FIELDS',
	UNAUTHORIZED = 'HAHOW_ASSIGNMENT_ERR_UNAUTHORIZED',
	FORBIDDEN = 'HAHOW_ASSIGNMENT_ERR_FORBIDDEN',
	SERVICE_UNAVAILABLE = 'HAHOW_ASSIGNMENT_ERR_SERVICE_UNAVAILABLE',
	NO_SUCH_HERO = 'HAHOW_ASSIGNMENT_ERR_NO_SUCH_HERO',
}

export type ApiConfig = {
	baseUrl: string;
	timeout?: number;
};

export type HeroProfile = {
	str: number;
	int: number;
	agi: number;
	luk: number;
};

export type Hero = {
	id: string;
	name: string;
	image: string;
	profile?: HeroProfile;
};
