import ResetPasswordForm from '@/components/app/loginUser-pages/reset-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '新しいパスワードの設定',
    robots: { index: false },
}

export default async function ResetPassword() {
    return <ResetPasswordForm />
}
