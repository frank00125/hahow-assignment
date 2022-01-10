import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

import request from 'supertest';
import expressApp from '../src/app';
import { ErrorCode } from '../src/types';

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
	});

	describe('SingleHero', () => {
		let heroId: string;
		beforeEach(async () => {
			const {
				body: { heroes },
			} = await request(expressApp)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');

			heroId = heroes?.[0]?.id;
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

		test('Wrong Hero ID Request Without Authentication Info', async () => {
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
	});
});
