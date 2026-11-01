import { SignUpForm } from '@/components/app/auth-pages/sign-up'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '新規登録',
}

export default async function Signup() {
    return <SignUpForm />
}
