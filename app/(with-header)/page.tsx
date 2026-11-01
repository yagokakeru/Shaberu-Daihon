import Home from '@/components/home'
import { getPlan } from '@/lib/functions/plan/getPlan'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '台本一覧',
}

export default async function HomePage() {
    const planInfo = await getPlan()

    return (
        <>
            <Home planInfo={planInfo} />
        </>
    )
}
