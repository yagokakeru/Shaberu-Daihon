'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import ProfilePhoto from '@/components/ui/profile-photo'
import { ProfileCard } from '@/components/ui/card/profile-card'
import { useEffect, useRef, useState } from 'react'
import ToastMessage from '@/components/ui/message/toast'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

import type { userPlan } from '@/types/userPlan'
import { Message } from '@/types/message'
import { cn } from '@/lib/utils'

export default function Header({ userPlan }: { userPlan: userPlan | null }) {
    const router = useRouter()
    const userProfile = useAtomValue(userProfileAtom)
    const userId = userProfile?.user_id
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isProfileCardOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) {
                setIsProfileCardOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [isProfileCardOpen])

    // プラン変更を監視してヘッダーを更新するためのリアルタイムチャンネルを作成
    useEffect(() => {
        if (!userId) return
        const supabase = createClient()
        let channel: ReturnType<typeof supabase.channel> | undefined
        let cancelled = false

        const subscribe = async () => {
            // Cookieから復元したセッションはRealtimeに自動で渡らないため、明示的に渡す
            // (渡さないと未ログイン扱いになり、RLSで通知が届かない)
            const {
                data: { session },
            } = await supabase.auth.getSession()
            await supabase.realtime.setAuth(session?.access_token ?? null)
            if (cancelled) return

            channel = supabase
                .channel('subscription-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'subscription',
                        filter: `user_id=eq.${userId}`,
                    },
                    () => router.refresh() // プランが変わったらヘッダーを含めて取得し直す
                )
                .subscribe()
        }
        subscribe()

        return () => {
            cancelled = true
            // removeChannel は購読が0件になると接続ごと切り、直後の再購読が止まるため unsubscribe を使う
            if (channel) channel.unsubscribe()
        }
    }, [userId, router])

    return (
        <header
            className={
                'bg-background-surface rounded-xl-pc flex items-center py-16-pc px-48-pc fixed top-16-pc left-1/2 translate-x-[-50%] w-pcvw-[1280] max-h-pcvw-[72] z-100 max-md:sticky max-md:top-16-sp max-md:left-auto max-md:translate-x-0 max-md:mx-16-sp max-md:mt-16-sp max-md:w-auto max-md:max-h-none max-md:p-12-sp max-md:rounded-xl-sp'
            }
        >
            {/* SP: ログイン時はロゴとメニューを左側で折り返し、未ログイン時はボタン群を2段目に折り返す */}
            <nav
                className={cn(
                    'flex justify-between items-center w-full',
                    !userProfile && 'max-md:flex-wrap max-md:gap-y-12-sp'
                )}
            >
                <div
                    className={cn(
                        'flex items-center gap-32-pc',
                        userProfile
                            ? 'max-md:flex-1 max-md:flex-wrap max-md:gap-8-sp'
                            : 'max-md:gap-32-sp'
                    )}
                >
                    <h1>
                        <Link href={'/'}>
                            <Image
                                className="w-pcvw-[170] max-md:w-spvw-[170]"
                                src={'/header_logo.svg'}
                                alt="logo"
                                width={100}
                                height={100}
                            ></Image>
                        </Link>
                    </h1>
                    <ul
                        className={cn(
                            'flex items-center gap-32-pc',
                            userProfile
                                ? 'max-md:gap-spvw-[20]'
                                : 'max-md:gap-32-sp'
                        )}
                    >
                        {userProfile && (
                            <li>
                                <Link
                                    className="text-body-default-pc max-md:text-body-default-sp"
                                    href={'/protected'}
                                >
                                    台本一覧
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                className="text-body-default-pc max-md:text-body-default-sp"
                                href={'/plan'}
                            >
                                プラン
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-8-pc max-md:gap-8-sp">
                    {userProfile ? (
                        <div ref={profileMenuRef}>
                            <div
                                onClick={() =>
                                    setIsProfileCardOpen((current) => !current)
                                }
                            >
                                <ProfilePhoto className="pointer-events-auto" />
                            </div>
                            <ProfileCard
                                userPlan={userPlan}
                                open={isProfileCardOpen}
                                onClose={() => setIsProfileCardOpen(false)}
                                setToastMessage={setToastMessage}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-24-pc max-md:gap-12-sp max-md:w-spvw-[216]">
                            <Button
                                asChild
                                size="sm"
                                variant={'secondary'}
                                className="max-md:flex-1"
                            >
                                <Link href="/sign-in">ログイン</Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                variant={'default'}
                                className="max-md:flex-1"
                            >
                                <Link href="/sign-up">新規登録</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </nav>

            {toastMessage && (
                <ToastMessage
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </header>
    )
}
