import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { AuthProvider } from '@/lib/providers/AuthProvider'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { LEGAL } from '@/lib/consts/legal'
import type { Metadata } from 'next'

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: {
        default: `${LEGAL.SERVICE_NAME}｜カメラ目線で話せるWebプロンプター`,
        template: `%s｜${LEGAL.SERVICE_NAME}`,
    },
    description:
        'カメラ目線のまま台本を読めるWebプロンプター。台本を作成して、自動スクロール・速度調整・鏡文字表示で動画撮影や配信をサポートします。ブラウザですぐ使えて、無料で始められます。',
}

const geistSans = Geist({
    display: 'swap',
    subsets: ['latin'],
})

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const userProfile = await getUserInfo()

    return (
        <html
            lang="ja"
            className={geistSans.className}
            suppressHydrationWarning
        >
            <body>
                <AuthProvider userProfile={userProfile}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
