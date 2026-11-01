import { LoginForm } from '@/components/app/auth-pages/sign-in'
import type { Message } from '@/types/message'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ログイン',
    description:
        'しゃべる台本にログインして、台本の作成・編集やプロンプター表示をご利用いただけます。',
}

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<Message>
}) {
    const initialMessage = await searchParams
    return <LoginForm initialMessage={initialMessage} />
}
