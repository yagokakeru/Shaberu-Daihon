import ResetPasswordForm from '@/components/app/loginUser-pages/reset-password'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'パスワード再設定',
}

export default async function ResetPassword() {
    return <ResetPasswordForm />
}
