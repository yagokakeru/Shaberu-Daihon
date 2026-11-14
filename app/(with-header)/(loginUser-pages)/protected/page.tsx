import { Protected } from '@/components/app/loginUser-pages/protected'
import { getAllScript } from '@/lib/actions/script/getScript'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '台本一覧',
    robots: { index: false },
}

export default async function ProtectedPage() {
    const [script, userPlan] = await Promise.all([
        getAllScript(),
        getUserPlan(),
    ])

    const isLimitReached =
        userPlan?.max_scripts != null &&
        userPlan.script_count >= userPlan.max_scripts

    return (
        <>
            <Protected script={script} isLimitReached={isLimitReached} />
        </>
    )
}
