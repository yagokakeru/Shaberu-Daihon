// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://2e55db9489f670fa82d8f934f4f00c8e@o4512388006412288.ingest.us.sentry.io/4512388191682560',
    enabled: process.env.NODE_ENV === 'production', // ローカル開発では送らない
    environment: process.env.VERCEL_ENV ?? 'development', // production / preview（ステージング）を区別する

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 0.1, // 10%のトレースをサンプリング（必要に応じて調整）

    // try/catch で受けている console.error も Sentry に送る
    integrations: [Sentry.captureConsoleIntegration({ levels: ['error'] })],

    dataCollection: {
        // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
        userInfo: false, // ユーザー情報（IDやIPアドレスなど）を自動で付けない
        cookies: false, // Supabase のログインCookieを送らない
        httpBodies: [], // リクエストの本文を送らない
        stackFrameVariables: false, // エラー発生時のローカル変数の値を送らない
    },
})
