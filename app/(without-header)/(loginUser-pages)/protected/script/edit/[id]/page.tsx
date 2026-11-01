import { EditComponent } from '@/components/app/loginUser-pages/script/edit'
import { getCachedEditScript } from '@/lib/functions/script/getCachedEditScript'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const script = await getCachedEditScript(id)

    return { title: script.data?.title || '台本' }
}

export default async function Editpage(props: Props) {
    const { id } = await props.params
    const script = await getCachedEditScript(id)

    return <EditComponent script={script} />
}
