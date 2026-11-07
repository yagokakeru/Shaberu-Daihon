// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://2e55db9489f670fa82d8f934f4f00c8e@o4512388006412288.ingest.us.sentry.io/4512388191682560',
    enabled: process.env.NODE_ENV === 'production', // ローカル開発では送らない
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 0.1, // 10%のトレースをサンプリング（必要に応じて調整）

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 0%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    dataCollection: {
        // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
        userInfo: false, // ユーザー情報（IDやIPアドレスなど）を自動で付けない
        cookies: false, // Supabase のログインCookieを送らない
        httpBodies: [], // リクエストの本文を送らない
        stackFrameVariables: false, // エラー発生時のローカル変数の値を送らない
    },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
