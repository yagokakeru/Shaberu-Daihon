// 法的表示ページで共通して使う値
export const LEGAL = {
    SERVICE_NAME: 'しゃべる台本',
    SERVICE_URL: 'https://script.kakechimaru.com/',
    CONTACT_EMAIL: 'info@kakechimaru.com',
    // 請求があった場合に開示する項目の表記
    DISCLOSE_ON_REQUEST: '請求があった場合、遅滞なく開示いたします。',
    // 制定日
    ENACTED_AT: '2026年10月15日',
    // プライバシーポリシーの最終改定日（内容を改定したら更新する）
    PRIVACY_REVISED_AT: '2026年11月7日',
} as const

export const LEGAL_PATHS = {
    TOKUSHOHO: '/legal/tokushoho',
    TERMS: '/legal/terms',
    PRIVACY: '/legal/privacy',
} as const
