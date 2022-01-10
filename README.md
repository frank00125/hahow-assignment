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

- axios: API Calling usage
- express: HTTP framework to build RESTful API

## Environment Variables

```
HAHOW_API_BASE_URL Base url for hahow assignment API
HAHOW_API_TIMEOUT Timeout Seconds while calling hahow assignment API
```

## 註解撰寫原則

1. 以流程導向為主撰寫
2. 不以細部程式碼，而是以區塊為主撰寫

## 專案困難點

在專案撰寫中，最大的困難點我覺得是在於 Single Hero API Endpoint 的部分。Single Hero API Endpoint 會隨機出現 status code 為 200，但是回傳內容為

```
{
  "code": 1000,
  "message": "Backend error"
}
```

這部分因為跟原先在 徵才小專案的 API Schema 並沒有寫到，而且也跟一般的 4xx 或 5xx 系列的 HTTP Status Code 不太一樣，需要特別檢查，並且回傳 HTTP Status Code 503，表示 API 背後的串接的服務或資料庫目前沒辦法得到結果。
另外針對 Hahow Heroes API 的部分，Response 的 JSON 是 array 的話，資安部分相對是不安全的，請參考下面連結: <br> http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
