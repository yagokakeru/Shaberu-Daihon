// 共通メッセージ定義です
export const MESSAGES = {
    // 共通
    REQUIRED_FIELD: (field: string) => `${field}は必須です`,
    MIN_LENGTH: (field: string, min: number) =>
        `${field}は${min}文字以上で入力してください`,
    MAX_LENGTH: (field: string, max: number) =>
        `${field}は${max}文字以内で入力してください`,
    EXACT_LENGTH: (field: string, len: number) =>
        `${field}は${len}文字で入力してください`,
    INVALID_FORMAT: (field: string) => `正しい${field}の形式で入力してください`,

    // フォーマット
    INVALID_EMAIL: '正しいメールアドレスを入力してください',
    INVALID_URL: '正しいURLを入力してください',
    INVALID_TEL: '正しい電話番号を入力してください（例：090-1234-5678）',
    INVALID_POSTAL_CODE: '正しい郵便番号を入力してください（例：123-4567）',
    INVALID_DATE: '正しい日付を入力してください（例：2025-01-01）',
    INVALID_TIME: '正しい時刻を入力してください（例：09:30）',
    INVALID_DATETIME: '正しい日時を入力してください（例：09:30）',
    INVALID_COLOR: '正しいカラーコードを入力してください（例：#FF0000）',
    INVALID_USERNAME:
        'ユーザー名には半角英数字、ハイフン、アンダースコアのみ使用できます',

    // パスワード
    PASSWORD_REQUIRE_UPPER: 'パスワードには大文字を1文字以上含めてください',
    PASSWORD_REQUIRE_LOWER: 'パスワードには小文字を1文字以上含めてください',
    PASSWORD_REQUIRE_DIGIT: 'パスワードには数字を1文字以上含めてください',
    PASSWORD_REQUIRE_SYMBOL: 'パスワードには記号を1文字以上含めてください',
    PASSWORD_REGEX: (max: number) =>
        `パスワードは半角英数字（大文字・小文字）を含む${max}文字以上で入力してください。`,
    PASSWORD_CONFIRM_MISMATCH: 'パスワードが一致しません',

    // 同意
    CONSENT_REQUIRED: '同意が必要です',

    // 数値
    NUMBER_MIN: (field: string, min: number) =>
        `${field}は${min}以上で入力してください`,
    NUMBER_MAX: (field: string, max: number) =>
        `${field}は${max}以下で入力してください`,
    NUMBER_INTEGER: '整数で入力してください',

    // ファイル
    FILE_TYPE_INVALID: (types: string) =>
        `ファイル形式は${types}のみ許可されています`,
    FILE_SIZE_EXCEEDED: (max: number) =>
        `${max}MB以下のファイルをアップロードしてください`,

    // その他
    CONFIRMATION_MISMATCH: (field: string) => `${field}が一致しません`,
    UNKNOWN_ERROR: '予期せぬエラーが発生しました',
    NETWORK_ERROR: 'ネットワーク接続に問題があります',
    UNAUTHORIZED: '認証情報が無効です。再ログインしてください',
    FORBIDDEN: 'アクセス権限がありません',
    VALIDATION_ERROR: '入力内容に誤りがあります',
    SERVER_ERROR: 'サーバーでエラーが発生しました',

    // 認証・アカウント（lib/actions/auth の Server Actions）
    SIGN_UP_INVALID_INPUT: '入力内容に誤りがあります。',
    USER_ALREADY_EXISTS: 'ユーザーはすでに存在しています。',
    SIGN_UP_FAILED:
        'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
    USER_INFO_FETCH_FAILED:
        'ユーザー情報を取得できませんでした。しばらくしてからもう一度お試しください。',
    SIGN_IN_FAILED:
        'ログインできませんでした。メールアドレスとパスワードを確認してください。',
    SIGN_OUT_FAILED:
        'ログアウトに失敗しました。しばらくしてからもう一度お試しください。',
    INVALID_ACCESS:
        '不正なアクセスです。しばらくしてからもう一度お試しください。',
    EMAIL_REQUIRED: 'メールアドレスを入力してください。',
    RESET_LINK_SEND_FAILED:
        'パスワードのリセットリンクの送信に失敗しました。しばらくしてからもう一度お試しください。',
    RESET_LINK_SENT:
        'パスワードのリセットリンクを送信しました。メールをご確認ください。',
    PASSWORD_UPDATE_FAILED: 'パスワードの更新に失敗しました。',
    PASSWORD_UPDATE_SUCCEEDED: 'パスワードの更新に成功しました。',
    DELETE_ACCOUNT_FAILED:
        'ユーザー削除に失敗しました。しばらくしてからもう一度お試しください。',
} as const
