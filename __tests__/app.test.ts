import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

import request from 'supertest';
import expressApp from '../src/app';
import { ErrorCode } from '../src/types';

import nock from 'nock';
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('Hahow Assignment Unit Test', () => {
	describe('List Heroes', () => {
		test('Normal Request Without Authentication Info', async () => {
			const response = await request(expressApp)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			const { statusCode, body } = response;
			expect(statusCode).toBeGreaterThanOrEqual(200);
			expect(statusCode).toBeLessThan(400);

			const { heroes } = body;
			expect(Array.isArray(heroes)).toBeTruthy();
			heroes.forEach(({ id, name, image }: any) => {
				expect(typeof id).toBe('string');
				expect(id.length).toBeGreaterThan(0);
				expect(typeof name).toBe('string');
				expect(name.length).toBeGreaterThan(0);
				expect(typeof image).toBe('string');
				expect(image.length).toBeGreaterThan(0);
			});
		});

		test(
			'Normal Request With Authentication Info',
			async () => {
				const response = await request(expressApp)
					.get('/heroes')
					.set('Accept', 'application/json')
					.set('Name', 'hahow')
					.set('Password', 'rocks')
					.set('Content-Type', 'application/json');

				const { statusCode, body } = response;
				expect(statusCode).toBeGreaterThanOrEqual(200);
				expect(statusCode).toBeLessThan(400);

				const { heroes } = body;
				expect(Array.isArray(heroes)).toBeTruthy();
				heroes.forEach(({ id, name, image, profile }: any) => {
					expect(typeof id).toBe('string');
					expect(id.length).toBeGreaterThan(0);
					expect(typeof name).toBe('string');
					expect(name.length).toBeGreaterThan(0);
					expect(typeof image).toBe('string');
					expect(image.length).toBeGreaterThan(0);
					expect(typeof profile).toBe('object');
					const profileEntries = Object.entries(profile);
					expect(profileEntries.length).toBeGreaterThan(0);
					profileEntries.forEach(([profileKey, profileValue]) => {
						expect(typeof profileKey).toBe('string');
						expect(profileKey.length).toBeGreaterThan(0);
						expect(typeof profileValue).toBe('number');
					});
				});
			},
			10 * 1000
		);

		test('Offline Request', async () => {
			nock.enableNetConnect(
				(host) => host.includes('localhost') || host.includes('127.0.0.1')
			);

			const {
				statusCode,
				body: { errorCode },
			} = await request(expressApp)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');
			expect(statusCode).toEqual(503);
			expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

			nock.cleanAll();
			nock.enableNetConnect();
		});

		test(
			'Timeout Request',
			async () => {
				nock(process.env.HAHOW_API_BASE_URL || '')
					.get('/heroes')
					.delay(15 * 1000)
					.reply(200, []);

				const response = await request(expressApp)
					.get('/heroes')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json');
				const {
					statusCode,
					body: { errorCode },
				} = response;
				expect(statusCode).toEqual(503);
				expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

				nock.cleanAll();
			},
			20 * 1000
		);
	});

	describe('SingleHero', () => {
		let heroId: string;
		let heroBody: any;
		beforeEach(async () => {
			const {
				body: { heroes },
			} = await request(expressApp)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			heroId = heroes?.[0]?.id;
			heroBody = heroes?.[0];
		});

		test('Normal Request Without Authentication Info', async () => {
			const response = await request(expressApp)
				.get(`/heroes/${heroId}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			const { statusCode, body } = response;

			if (statusCode >= 200 && statusCode < 400) {
				const { id, name, image } = body;
				expect(typeof id).toBe('string');
				expect(id.length).toBeGreaterThan(0);
				expect(typeof name).toBe('string');
				expect(name.length).toBeGreaterThan(0);
				expect(typeof image).toBe('string');
				expect(image.length).toBeGreaterThan(0);
			}

			if (statusCode >= 400) {
				const { errorCode, message } = body;
				expect(typeof errorCode).toBe('string');
				expect(errorCode.length).toBeGreaterThan(0);
				expect(Object.values(ErrorCode).includes(errorCode)).toBeTruthy();
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			}
		});

		test(
			'Normal Request With Authentication Info',
			async () => {
				const response = await request(expressApp)
					.get(`/heroes/${heroId}`)
					.set('Accept', 'application/json')
					.set('Name', 'hahow')
					.set('Password', 'rocks')
					.set('Content-Type', 'application/json');

				const { statusCode, body } = response;

				if (statusCode >= 200 && statusCode < 400) {
					const { id, name, image, profile } = body;
					expect(typeof id).toBe('string');
					expect(id.length).toBeGreaterThan(0);
					expect(typeof name).toBe('string');
					expect(name.length).toBeGreaterThan(0);
					expect(typeof image).toBe('string');
					expect(image.length).toBeGreaterThan(0);
					expect(typeof profile).toBe('object');
					const profileEntries = Object.entries(profile);
					expect(profileEntries.length).toBeGreaterThan(0);
					profileEntries.forEach(([profileKey, profileValue]) => {
						expect(typeof profileKey).toBe('string');
						expect(profileKey.length).toBeGreaterThan(0);
						expect(typeof profileValue).toBe('number');
					});
				}

				if (statusCode >= 400) {
					const { errorCode, message } = body;
					expect(typeof errorCode).toBe('string');
					expect(errorCode.length).toBeGreaterThan(0);
					expect(Object.values(ErrorCode).includes(errorCode)).toBeTruthy();
					expect(typeof message).toBe('string');
					expect(message.length).toBeGreaterThan(0);
				}
			},
			10 * 1000
		);

		test(
			'Normal Request With Wrong Authentication Info',
			async () => {
				const responseWithWrongNameOrPassword = await request(expressApp)
					.get(`/heroes/${heroId}`)
					.set('Accept', 'application/json')
					.set('Name', 'hahow')
					.set('Password', 'rockssss')
					.set('Content-Type', 'application/json');

				const {
					statusCode: statusCodeWithWrongNameOrPassword,
					body: bodyWithWrongNameOrPassword,
				} = responseWithWrongNameOrPassword;

				if (
					statusCodeWithWrongNameOrPassword >= 200 &&
					statusCodeWithWrongNameOrPassword < 400
				) {
					const { id, name, image, profile } = bodyWithWrongNameOrPassword;
					expect(typeof id).toBe('string');
					expect(id.length).toBeGreaterThan(0);
					expect(typeof name).toBe('string');
					expect(name.length).toBeGreaterThan(0);
					expect(typeof image).toBe('string');
					expect(image.length).toBeGreaterThan(0);
					expect(profile).toBeUndefined();
				}

				if (statusCodeWithWrongNameOrPassword >= 400) {
					const { errorCode, message } = bodyWithWrongNameOrPassword;
					expect(typeof errorCode).toBe('string');
					expect(errorCode.length).toBeGreaterThan(0);
					expect(Object.values(ErrorCode).includes(errorCode)).toBeTruthy();
					expect(typeof message).toBe('string');
					expect(message.length).toBeGreaterThan(0);
				}
			},
			10 * 1000
		);

		test('Normal Request With No Related Authentication Header', async () => {
			const responseWithNoNameAndPassword = await request(expressApp)
				.get(`/heroes/${heroId}`)
				.set('Accept', 'application/json')
				.set('show', 'me the secret')
				.set('Content-Type', 'application/json');

			const {
				statusCode: statusCodeWithNoNameAndPassword,
				body: bodyWithNoNameAndPassword,
			} = responseWithNoNameAndPassword;

			if (
				statusCodeWithNoNameAndPassword >= 200 &&
				statusCodeWithNoNameAndPassword < 400
			) {
				const { id, name, image, profile } = bodyWithNoNameAndPassword;
				expect(typeof id).toBe('string');
				expect(id.length).toBeGreaterThan(0);
				expect(typeof name).toBe('string');
				expect(name.length).toBeGreaterThan(0);
				expect(typeof image).toBe('string');
				expect(image.length).toBeGreaterThan(0);
				expect(profile).toBeUndefined();
			}

			if (statusCodeWithNoNameAndPassword >= 400) {
				const { errorCode, message } = bodyWithNoNameAndPassword;
				expect(typeof errorCode).toBe('string');
				expect(errorCode.length).toBeGreaterThan(0);
				expect(Object.values(ErrorCode).includes(errorCode)).toBeTruthy();
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			}
		});

		test('Wrong Hero ID Request', async () => {
			const response = await request(expressApp)
				.get('/heroes/test')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			const { statusCode, body } = response;
			expect([404, 503].includes(statusCode)).toBeTruthy();

			const { errorCode, message } = body;
			expect(typeof errorCode).toBe('string');
			expect(errorCode.length).toBeGreaterThan(0);
			expect(Object.values(ErrorCode).includes(errorCode)).toBeTruthy();
			expect(typeof message).toBe('string');
			expect(message.length).toBeGreaterThan(0);
		});

		test(
			'Abnormal Request For Hero Profile API With Authentication Info',
			async () => {
				nock(process.env.HAHOW_API_BASE_URL || '')
					.get(`/heroes/${heroId}/profile`)
					.reply(404, 'Not Found');

				const response = await request(expressApp)
					.get(`/heroes/${heroId}`)
					.set('Name', 'hahow')
					.set('Password', 'rocks')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json');
				const {
					statusCode,
					body: { errorCode },
				} = response;
				expect(statusCode).toEqual(503);
				expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

				nock.cleanAll();
			},
			20 * 1000
		);

		test('Offline Request', async () => {
			nock.enableNetConnect(
				(host) => host.includes('localhost') || host.includes('127.0.0.1')
			);

			const {
				statusCode,
				body: { errorCode },
			} = await request(expressApp)
				.get(`/heroes/${heroId}`)
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');
			expect(statusCode).toEqual(503);
			expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

			nock.cleanAll();
			nock.enableNetConnect();
		});

		test(
			'Timeout Request Without Authentication Info',
			async () => {
				nock(process.env.HAHOW_API_BASE_URL || '')
					.get(`/heroes/${heroId}`)
					.delay(15 * 1000)
					.reply(200, heroBody);

				const response = await request(expressApp)
					.get(`/heroes/${heroId}`)
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json');
				const {
					statusCode,
					body: { errorCode },
				} = response;
				expect(statusCode).toEqual(503);
				expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

				nock.cleanAll();
			},
			20 * 1000
		);

		test(
			'Timeout Request For Hero Profile API endpoint With Authentication Info',
			async () => {
				nock(process.env.HAHOW_API_BASE_URL || '')
					.get(`/heroes/${heroId}/profile`)
					.delay(15 * 1000)
					.reply(200, heroBody);

				const response = await request(expressApp)
					.get(`/heroes/${heroId}`)
					.set('Name', 'hahow')
					.set('Password', 'rocks')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json');
				const {
					statusCode,
					body: { errorCode },
				} = response;
				expect(statusCode).toEqual(503);
				expect(errorCode).toEqual(ErrorCode.SERVICE_UNAVAILABLE);

				nock.cleanAll();
			},
			20 * 1000
		);
	});
});
