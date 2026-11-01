import Home from '@/components/home'
import { getPlan } from '@/lib/functions/plan/getPlan'

export default async function HomePage() {
    const planInfo = await getPlan()

    return (
        <>
            <Home planInfo={planInfo} />
        </>
    )
}
