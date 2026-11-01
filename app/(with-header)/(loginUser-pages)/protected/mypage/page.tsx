import { MypageComponent } from '@/components/app/loginUser-pages/mypage'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'マイページ',
    robots: { index: false },
}

export default async function Mypage() {
    const userPlan = await getUserPlan()

    return <MypageComponent userPlan={userPlan} />
}
