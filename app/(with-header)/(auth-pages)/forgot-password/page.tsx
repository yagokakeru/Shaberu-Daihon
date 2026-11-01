import ForgotPasswordForm from '@/components/app/auth-pages/forgot-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '新しいパスワードの設定',
}

export default async function ForgotPassword() {
    return <ForgotPasswordForm />
}
