import type { scriptData } from '@/types/script'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { useAtomValue } from 'jotai'
import { deleteFavorite, insertFavorite } from '@/lib/actions/script/favorite'
import { deleteScript } from '@/lib/actions/script/deleteScript'
import { useEditScriptForm } from '@/lib/validation/hooks'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import { cn } from '@/lib/utils'
import { dateFormat } from '@/lib/functions/dateFormat'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { editScriptName } from '@/lib/actions/script/editScript'
import type { Message } from '@/types/message'
import { Lock } from 'lucide-react'

export default function ScriptCard({
    scriptInfo,
    className,
    setToastMessage,
}: {
    scriptInfo: scriptData
    className?: string
    setToastMessage: (message: Message) => void
}) {
    const userProfile = useAtomValue(userProfileAtom)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const { form, onSubmit } = useEditScriptForm(scriptInfo)
    const name = form.watch('name')
    const router = useRouter()

    const handleDelete = async () => {
        await deleteScript(scriptInfo.id)
        router.refresh()
    }

    useEffect(() => {
        if (name === scriptInfo.title) return

        const timeout = setTimeout(async () => {
            const result = await editScriptName(name, scriptInfo.id)

            if (result.messageType === 'success') {
                setToastMessage(result)
            }
        }, 2000)
        return () => clearTimeout(timeout)
    }, [name, scriptInfo.id, scriptInfo.title, setToastMessage])

    if (!userProfile) return null

    return (
        <div
            className={cn(
                `bg-background-surface border-border-focus border-solid border-t-pcvw-[4] max-md:border-t-spvw-[4] rounded-lg-pc max-md:rounded-lg-sp py-24-pc max-md:py-24-sp px-16-pc max-md:px-16-sp`,
                className
            )}
        >
            <div className={`${scriptInfo.isLocked && 'opacity-50'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="aspect-square bg-background-primary flex items-center justify-center text-text-onPrimary text-heading-h3-pc max-md:text-heading-h3-sp rounded-md-pc max-md:rounded-md-sp w-pcvw-[32] max-md:w-spvw-[32]">
                        {scriptInfo.plain_content
                            ? scriptInfo.plain_content.slice(0, 1).toUpperCase()
                            : '台'}
                    </h3>
                    <div className="flex items-center gap-8-pc max-md:gap-8-sp">
                        {scriptInfo.isLocked && (
                            <Lock
                                className="w-pcvw-[20] max-md:w-spvw-[20] h-auto"
                                aria-label="ロック中"
                            />
                        )}
                        <svg
                            className="cursor-pointer block w-pcvw-[20] max-md:w-spvw-[20] h-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 19"
                            onClick={async () => {
                                if (scriptInfo.isFavorite) {
                                    await deleteFavorite(
                                        scriptInfo.id,
                                        userProfile.user_id
                                    )
                                } else {
                                    await insertFavorite(
                                        scriptInfo.id,
                                        userProfile.user_id
                                    )
                                }

                                router.refresh()
                            }}
                        >
                            <path
                                className={
                                    scriptInfo.isFavorite
                                        ? 'fill-yellow-500'
                                        : 'fill-black'
                                }
                                d="M6.85,14.83l3.15-1.9,3.15,1.93-.83-3.6,2.78-2.4-3.65-.33-1.45-3.4-1.45,3.38-3.65.33,2.78,2.43-.83,3.58ZM3.83,19l1.63-7.03L0,7.25l7.2-.63L10,0l2.8,6.63,7.2.63-5.45,4.73,1.63,7.03-6.18-3.73-6.18,3.73Z"
                            />
                            <polygon
                                className={
                                    scriptInfo.isFavorite
                                        ? 'fill-yellow-500'
                                        : 'fill-transparent'
                                }
                                points="10 4.97 8.5 8.45 4.74 8.79 7.6 11.29 6.75 14.98 10 13.02 13.25 15 12.4 11.29 15.26 8.81 11.5 8.48 10 4.97"
                            />
                        </svg>
                    </div>
                </div>
                <form
                    className="mt-16-pc max-md:mt-16-sp"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <Input
                        className="border-none"
                        {...form.register('name')}
                        disabled={scriptInfo.isLocked}
                    />
                </form>
                <p className="text-body-small-pc max-md:text-body-small-sp text-text-secondary mt-8-pc max-md:mt-8-sp">
                    最終更新日：{dateFormat(scriptInfo.updated_at)}
                </p>
                <p className="text-body-notice-pc max-md:text-body-notice-sp text-text-secondary mt-16-pc max-md:mt-16-sp line-clamp-3">
                    {scriptInfo.plain_content}
                </p>
            </div>
            <div className="flex flex-wrap justify-between gap-y-12-pc max-md:gap-y-12-sp mt-40-pc max-md:mt-40-sp">
                {scriptInfo.isLocked ? (
                    <>
                        <Button
                            size="default"
                            variant={'default'}
                            className="w-full"
                            asChild
                        >
                            <Link href="/plan">プランをアップグレード</Link>
                        </Button>
                        <Button
                            size="default"
                            variant={'ghost'}
                            className="w-full"
                            onClick={async () => {
                                setConfirmDialogOpen(true)
                            }}
                        >
                            削除
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            asChild
                            size="default"
                            variant={'default'}
                            className="w-[48%]"
                        >
                            <Link
                                href={`/protected/script/edit/${scriptInfo.id}`}
                            >
                                編集
                            </Link>
                        </Button>
                        <Button
                            size="default"
                            variant={'ghost'}
                            className="w-[48%]"
                            onClick={async () => {
                                setConfirmDialogOpen(true)
                            }}
                        >
                            削除
                        </Button>
                        <Button
                            size="default"
                            variant={'secondary'}
                            className="w-full"
                            asChild
                        >
                            <Link
                                href={`/protected/script/prompter/${scriptInfo.id}`}
                            >
                                プロンプターで表示
                            </Link>
                        </Button>
                    </>
                )}
            </div>
            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleDelete}
                title={`台本を削除しますか？`}
                description={`${scriptInfo.title} を削除しますか？\nこの操作は元に戻せません`}
            />
        </div>
    )
}
