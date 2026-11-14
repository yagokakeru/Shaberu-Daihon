'use client'

import { useAtomValue } from 'jotai'
import { createScript } from '@/lib/actions/script/createScript'
import type { Message } from '@/types/message'
import { Button } from '@/components/ui/button'
import ToastMessage from '@/components/ui/message/toast'
import { useState } from 'react'
import { userProfileAtom } from '@/lib/atoms/authUser'
import ScriptCard from '@/components/ui/card/script'
import SortButton from '@/components/ui/sort_buttom'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { script } from '@/types/script'
import type { SortCategory, SortOrder } from '@/types/sort'

export function Protected({
    script,
    isLimitReached,
}: {
    script: script
    isLimitReached: boolean
}) {
    const userProfile = useAtomValue(userProfileAtom)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [sortCategory, setSortCategory] = useState<SortCategory>('作成日')
    const [sortOrder, setSortOrder] = useState<SortOrder>('降順')
    const sortedScripts = [...(script.data ?? [])].sort((a, b) => {
        if (sortCategory === 'お気に入りを優先') {
            return Number(b.isFavorite) - Number(a.isFavorite)
        }

        const aDate =
            sortCategory === '作成日'
                ? new Date(a.inserted_at).getTime()
                : new Date(a.updated_at).getTime()

        const bDate =
            sortCategory === '作成日'
                ? new Date(b.inserted_at).getTime()
                : new Date(b.updated_at).getTime()

        return sortOrder === '昇順' ? aDate - bDate : bDate - aDate
    })

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    if (!userProfile) return <div>Loading...</div>

    const handleCreateScript = async () => {
        const result = await createScript(userProfile.user_id)
        setToastMessage(result)
    }

    return (
        <section className="pt-pcvw-[150] max-md:pt-32-sp">
            <div className="w-pcvw-[1280] mx-auto max-md:w-auto max-md:mx-16-sp">
                <h1
                    className={cn(
                        'text-heading-h1-pc max-md:text-heading-h1-sp',
                        // SP: 空状態の見出しは1行に収まるようH2サイズにする
                        sortedScripts.length === 0 &&
                            'max-md:text-heading-h2-sp'
                    )}
                >
                    {sortedScripts.length > 0
                        ? '台本一覧'
                        : '台本を作成してみましょう！'}
                </h1>

                <div className="flex items-center gap-x-16-pc max-md:gap-x-16-sp max-md:flex-wrap max-md:gap-y-12-sp mt-24-pc max-md:mt-24-sp">
                    {isLimitReached ? (
                        <Button size="default" variant={'default'} asChild>
                            <Link href="/plan">プランをアップグレード</Link>
                        </Button>
                    ) : (
                        <Button
                            size="default"
                            variant={'default'}
                            onClick={() => {
                                handleCreateScript()
                            }}
                        >
                            新規作成
                        </Button>
                    )}
                    {sortedScripts.length > 0 && (
                        <SortButton
                            sortCategory={sortCategory}
                            sortOrder={sortOrder}
                            onChangeCategory={setSortCategory}
                            onChangeOrder={setSortOrder}
                        />
                    )}
                </div>
                {isLimitReached && (
                    <div className="text-text-secondary text-sm mt-4">
                        台本の作成上限に達しています。プランをアップグレードしてください。
                    </div>
                )}

                <div className="flex flex-wrap gap-y-40-pc gap-x-24-pc mt-48-pc max-md:flex-col max-md:gap-y-24-sp max-md:mt-24-sp">
                    {sortedScripts.length > 0 ? (
                        sortedScripts.map((item) => {
                            return (
                                <ScriptCard
                                    key={item['id']}
                                    scriptInfo={item}
                                    className="w-pcvw-[302] max-md:w-full"
                                    setToastMessage={setToastMessage}
                                />
                            )
                        })
                    ) : (
                        <div
                            className="aspect-[302/322] cursor-pointer rounded-lg-pc border-border border-dashed border-[2px] p-24-pc max-md:p-24-sp flex items-center justify-center flex-col gap-y-12-pc max-md:gap-y-12-sp w-pcvw-[302] max-md:w-full max-md:aspect-auto max-md:h-spvw-[322] max-md:rounded-xl-sp max-md:border-border-strong"
                            onClick={() => {
                                handleCreateScript()
                            }}
                        >
                            <Plus size="48" strokeWidth={2} />
                            <p className="text-heading-h3-pc max-md:text-heading-h3-sp text-center">
                                新規作成
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {toastMessage && (
                <ToastMessage
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </section>
    )
}
