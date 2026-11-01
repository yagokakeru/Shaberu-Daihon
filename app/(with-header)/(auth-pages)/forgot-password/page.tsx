import ForgotPasswordForm from '@/components/app/auth-pages/forgot-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'パスワード再設定',
    description:
        'しゃべる台本のパスワードを再設定するためのメールを送信します。',
    robots: { index: false },
}

export default async function ForgotPassword() {
    return <ForgotPasswordForm />
}
