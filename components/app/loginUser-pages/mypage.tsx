'use client'

import type { Message } from '@/types/message'
import { MypageProfile } from '@/components/ui/mypage/profile'
import { MypagePlan } from '@/components/ui/mypage/plan'
import { MypageAccount } from '@/components/ui/mypage/account'
import ToastMessage from '@/components/ui/message/toast'
import type { userPlan } from '@/types/userPlan'
import { CircleUserRound, CreditCard, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { signOutAction } from '@/lib/actions/auth/signOut'

export function MypageComponent({ userPlan }: { userPlan: userPlan | null }) {
    type Tab = 'profile' | 'plan' | 'account'
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [isSigningOut, setIsSigningOut] = useState(false)

    // 成功時は signOutAction 内で /sign-in に redirect されるため、戻ってくるのは失敗時のみ
    const handleSignOut = async () => {
        if (isSigningOut) return
        setIsSigningOut(true)
        const message = await signOutAction()
        setToastMessage(message)
        setIsSigningOut(false)
    }

    return (
        <>
            <section className="pt-pcvw-[150] max-md:pt-32-sp">
                <div className="w-pcvw-[1280] mx-auto max-md:w-auto max-md:mx-16-sp">
                    <h1 className="text-heading-h1-pc max-md:text-heading-h1-sp">
                        マイページ
                    </h1>
                    <div className="flex items-start gap-x-32-pc mt-64-pc max-md:flex-col max-md:gap-y-24-sp max-md:mt-24-sp">
                        <div className="bg-background-surface rounded-md-pc max-md:rounded-md-sp p-8-pc max-md:p-8-sp w-pcvw-[320] min-h-pcvw-[370] max-md:w-full max-md:min-h-0">
                            <div className="flex flex-col gap-y-8-pc max-md:gap-y-8-sp">
                                <div
                                    className={`cursor-pointer rounded-sm-pc max-md:rounded-sm-sp py-16-pc max-md:py-16-sp px-24-pc max-md:px-24-sp flex items-center gap-8-pc max-md:gap-8-sp hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'profile' ? 'bg-background-surface-active border-l-pcvw-[4] max-md:border-l-spvw-[4] border-l-border-strong border-solid' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <CircleUserRound className="block w-pcvw-[20] max-md:w-spvw-[20] h-auto" />
                                    <div className="text-body-default-pc max-md:text-body-default-sp">
                                        プロフィール
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-sm-pc max-md:rounded-sm-sp py-16-pc max-md:py-16-sp px-24-pc max-md:px-24-sp flex items-center gap-8-pc max-md:gap-8-sp hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'plan' ? 'bg-background-surface-active border-l-pcvw-[4] max-md:border-l-spvw-[4] border-l-border-strong border-solid' : ''}`}
                                    onClick={() => setActiveTab('plan')}
                                >
                                    <CreditCard className="block w-pcvw-[20] max-md:w-spvw-[20] h-auto" />
                                    <div className="text-body-default-pc max-md:text-body-default-sp">
                                        プラン
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-sm-pc max-md:rounded-sm-sp py-16-pc max-md:py-16-sp px-24-pc max-md:px-24-sp flex items-center gap-8-pc max-md:gap-8-sp hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'account' ? 'bg-background-surface-active border-l-pcvw-[4] max-md:border-l-spvw-[4] border-l-border-strong border-solid' : ''}`}
                                    onClick={() => setActiveTab('account')}
                                >
                                    <Settings className="block w-pcvw-[20] max-md:w-spvw-[20] h-auto" />
                                    <div className="text-body-default-pc max-md:text-body-default-sp">
                                        アカウント操作
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-8-pc max-md:gap-y-8-sp mt-128-pc max-md:mt-16-sp">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-sm-pc max-md:rounded-sm-sp py-16-pc max-md:py-16-sp px-24-pc max-md:px-24-sp flex items-center gap-8-pc max-md:gap-8-sp w-full text-left hover:bg-background-surface-hover active:bg-background-surface-active disabled:cursor-not-allowed"
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                >
                                    <LogOut className="block w-pcvw-[20] max-md:w-spvw-[20] h-auto" />
                                    <div className="text-body-default-pc max-md:text-body-default-sp">
                                        {isSigningOut
                                            ? 'ログアウト中...'
                                            : 'ログアウト'}
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="bg-background-surface rounded-md-pc max-md:rounded-md-sp px-24-pc max-md:px-24-sp pt-24-pc max-md:pt-24-sp pb-64-pc max-md:pb-64-sp w-full">
                            {activeTab === 'profile' && (
                                <MypageProfile
                                    setToastMessage={setToastMessage}
                                />
                            )}
                            {activeTab === 'plan' && (
                                <MypagePlan
                                    userPlan={userPlan}
                                    setToastMessage={setToastMessage}
                                />
                            )}
                            {activeTab === 'account' && (
                                <MypageAccount
                                    setToastMessage={setToastMessage}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {toastMessage && (
                    <ToastMessage
                        message={toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                )}
            </section>
        </>
    )
}
