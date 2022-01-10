# Hahow Assignment - Hero

## How to Start the Server

You can just use npm start to start the server or use the command `npx ts-node src/index.ts` to start it.

## File Structure

- `__tests__`
  - app.test.ts: Integration Testing for express app
- src
  - middleware
    - auth.ts: auth middleware
  - apiFunc
    - listHeroes.ts: main implementation for list heroes endpoint
    - singleHero.ts: main implementation for single hero endpoint
  - service
    - api
      - apiInstance.ts: Create Axios Instance about Hahow Assignment - Hero API
      - authenticate.ts: Check Authentication from API
      - heroProfile.ts: Get hero profile with given hero id from API
      - listHeroes.ts: Get all heroes from API
      - singleHero.ts: Get hero info with given id from API
  - app.ts: express app implementation
  - index.ts: express app listener
  - types.ts: generic types or enums

## Route

- /sign-in sign-in endpoint
- /token/refresh refresh token endpoint

## Package Usage

- axios
- express

## Environment Variables

```
HAHOW_API_BASE_URL Base url for hahow assignment API
HAHOW_API_TIMEOUT Timeout Seconds while calling hahow assignment API
```
