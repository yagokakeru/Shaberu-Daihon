import { SignUpForm } from '@/components/app/auth-pages/sign-up'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '新規登録',
    description:
        'しゃべる台本の新規登録ページです。メールアドレスで登録して、無料で始められます。',
}

export default async function Signup() {
    return <SignUpForm />
}
