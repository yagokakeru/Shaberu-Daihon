import ProfilePhoto from '@/components/ui/profile-photo'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import { signOutAction } from '@/app/actions'
import { PlanBadge } from '@/components/ui/plan-badge'
import Link from 'next/link'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import type { userPlan } from '@/types/userPlan'
import type { Message } from '@/types/message'

const profilePhotoVariants = cva(
    `bg-background-surface rounded-xl-pc flex items-center flex-col gap-24-pc mt-16-pc p-24-pc shadow-pcvw-[16] shadow-shadow absolute top-full right-0
    max-md:left-0 max-md:rounded-xl-sp max-md:gap-24-sp max-md:mt-16-sp max-md:p-24-sp max-md:shadow-spvw-[16]
    transition-all duration-button ease-button`,
    {
        variants: {
            open: {
                true: 'opacity-100 translate-y-0 pointer-events-auto',
                false: 'opacity-0 -translate-y-4-pc pointer-events-none',
            },
        },
        defaultVariants: {
            open: false,
        },
    }
)

export interface ProfileCardProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof profilePhotoVariants> {
    open: boolean
    onClose?: () => void
    userPlan: userPlan | null
    setToastMessage: (message: Message) => void
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
    (
        { className, open, onClose, userPlan, setToastMessage, ...props },
        ref
    ) => {
        const userProfile = useAtomValue(userProfileAtom)

        return (
            <div
                className={cn(profilePhotoVariants({ open, className }))}
                ref={ref}
                {...props}
            >
                <div className="flex items-center flex-col gap-4-pc max-md:gap-4-sp">
                    <ProfilePhoto className="pointer-events-none" />
                    <div className="text-body-default-pc max-md:text-body-default-sp">
                        {userProfile?.name || userProfile?.email}
                    </div>
                    {userProfile?.name && (
                        <div className="text-body-notice-pc max-md:text-body-notice-sp">
                            {userProfile?.email}
                        </div>
                    )}
                </div>
                {userPlan ? (
                    <div className="flex items-center flex-col gap-8-pc max-md:gap-8-sp">
                        <div className="flex items-center gap-4-pc max-md:gap-4-sp">
                            <div className="text-body-small-pc max-md:text-body-small-sp">
                                現在のプラン：
                            </div>
                            <PlanBadge
                                variant={
                                    userPlan.stripe_price_id
                                        ? 'paid'
                                        : 'default'
                                }
                            >
                                {userPlan.name ?? 'フリー'}
                            </PlanBadge>
                        </div>
                        <div className="text-body-notice-pc max-md:text-body-notice-sp">
                            <span className="text-body-strong-pc max-md:text-body-strong-sp">
                                {userPlan.script_count} /{' '}
                                {userPlan.max_scripts
                                    ? userPlan.max_scripts
                                    : '無制限'}
                            </span>{' '}
                            作成済み
                        </div>
                        <Button size={'sm'} asChild>
                            <Link href={'/plan'} onClick={onClose}>
                                アップグレード
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="text-body-notice-pc max-md:text-body-notice-sp">
                        ユーザー情報を取得できませんでした。
                    </div>
                )}
                <div className="flex items-center w-full justify-between w-pcvw-[230] max-md:w-auto max-md:justify-center max-md:gap-8-sp">
                    <Button
                        variant={'secondary'}
                        size={'sm'}
                        className="w-pcvw-[110] max-md:w-auto"
                        asChild
                    >
                        <Link href={'/protected/mypage'} onClick={onClose}>
                            マイページ
                        </Link>
                    </Button>
                    <form onSubmit={onClose}>
                        <SubmitButton
                            className="w-pcvw-[110] max-md:w-auto"
                            pendingText="ログアウト中..."
                            variant={'ghost'}
                            size={'sm'}
                            formAction={async () => {
                                const message = await signOutAction()
                                setToastMessage(message)
                            }}
                        >
                            ログアウト
                        </SubmitButton>
                    </form>
                </div>
            </div>
        )
    }
)

ProfileCard.displayName = 'ProfileCard'

export { ProfileCard }
