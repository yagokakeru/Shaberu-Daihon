import { LoginForm } from '@/components/app/auth-pages/sign-in'
import type { Message } from '@/types/message'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ログイン',
}

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<Message>
}) {
    const initialMessage = await searchParams
    return <LoginForm initialMessage={initialMessage} />
}
