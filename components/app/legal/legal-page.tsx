import type { ReactNode } from 'react'

/**
 * 法的表示ページ（特定商取引法に基づく表記・利用規約・プライバシーポリシー）の共通レイアウト
 */
export function LegalPage({
    title,
    enactedAt,
    revisedAt,
    children,
}: {
    title: string
    enactedAt: string
    revisedAt?: string
    children: ReactNode
}) {
    return (
        <section className="pt-pcvw-[150] max-md:pt-32-sp">
            <div className="w-pcvw-[880] mx-auto max-md:w-auto max-md:mx-16-sp">
                <h1 className="text-heading-h1-pc max-md:text-heading-h1-sp">
                    {title}
                </h1>
                <div className="flex flex-col gap-y-40-pc mt-48-pc max-md:gap-y-32-sp max-md:mt-32-sp">
                    {children}
                </div>
                <p className="text-body-small-pc text-text-secondary text-right mt-48-pc max-md:text-body-small-sp max-md:mt-32-sp">
                    制定日：{enactedAt}
                    {revisedAt && (
                        <>
                            <br />
                            最終改定日：{revisedAt}
                        </>
                    )}
                </p>
            </div>
        </section>
    )
}

/**
 * 見出し付きの条文・項目
 */
export function LegalSection({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section>
            <h2 className="text-heading-h3-pc max-md:text-heading-h3-sp">
                {title}
            </h2>
            <div className="flex flex-col gap-y-8-pc text-body-default-pc mt-12-pc max-md:gap-y-8-sp max-md:text-body-default-sp max-md:mt-12-sp">
                {children}
            </div>
        </section>
    )
}

/**
 * 番号付きリスト
 */
export function LegalList({ items }: { items: ReactNode[] }) {
    return (
        <ol className="list-decimal flex flex-col gap-y-4-pc pl-24-pc max-md:gap-y-4-sp max-md:pl-24-sp">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ol>
    )
}

/**
 * 項目名と内容の表（特定商取引法に基づく表記で使用）
 */
export function LegalTable({
    rows,
}: {
    rows: { label: string; content: ReactNode }[]
}) {
    return (
        <dl className="border-t border-border">
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="grid grid-cols-[30%_1fr] gap-x-24-pc border-b border-border py-16-pc max-md:grid-cols-1 max-md:gap-y-4-sp max-md:py-16-sp"
                >
                    <dt className="text-body-strong-pc max-md:text-body-strong-sp">
                        {row.label}
                    </dt>
                    <dd className="text-body-default-pc max-md:text-body-default-sp">
                        {row.content}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
