import { PlanComponent } from '@/components/app/plan'
import { getPlan } from '@/lib/functions/plan/getPlan'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '料金プラン',
    description:
        'しゃべる台本の料金プランをご案内します。無料のフリープランから、台本を作成できる数に応じて選べます。',
}

export default async function Pricing() {
    const planInfo = await getPlan()
    const userInfo = await getUserInfo()
    const userPlan = await getUserPlan()

    return (
        <PlanComponent
            planInfo={planInfo}
            userInfo={userInfo}
            userPlan={userPlan}
        />
    )
}
