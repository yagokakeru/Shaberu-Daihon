'use client'

import { useAtom, useAtomValue } from 'jotai'
import { isFavorited } from '@/lib/actions/script/favorite'
import { createScript } from '@/lib/actions/script/createScript'
import type { Message } from '@/types/message'
import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ToastMessage from '@/components/ui/message/toast'
import { useState, useEffect } from 'react'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { scriptFavoriteAtom } from '@/lib/atoms/scriptFavorite'
import ScriptCard from '@/components/ui/card/script'
import SortButton from '@/components/ui/sort_buttom'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { script } from '@/types/script'
import type { SortCategory, SortOrder } from '@/types/sort'

export function Protected({
    script,
    isLimitReached,
}: {
    script: script
    isLimitReached: boolean
}) {
    const userProfile = useAtomValue(userProfileAtom)
    const [scriptFavorite, setScriptFavorite] = useAtom(scriptFavoriteAtom)
    const [toastMessage, setToastMessage] = useState<Message | null>(null)
    const [sortCategory, setSortCategory] = useState<SortCategory>('作成日')
    const [sortOrder, setSortOrder] = useState<SortOrder>('降順')
    const sortedScripts = [...(scriptFavorite ?? [])].sort((a, b) => {
        if (sortCategory === 'お気に入りを優先') {
            return Number(b.isFavorite) - Number(a.isFavorite)
        }

        const aDate =
            sortCategory === '作成日'
                ? new Date(a.data.inserted_at).getTime()
                : new Date(a.data.updated_at).getTime()

        const bDate =
            sortCategory === '作成日'
                ? new Date(b.data.inserted_at).getTime()
                : new Date(b.data.updated_at).getTime()

        return sortOrder === '昇順' ? aDate - bDate : bDate - aDate
    })

    useEffect(() => {
        if (!script.data) return

        const fetchFavorites = async () => {
            const results = await Promise.all(
                script.data!.map(async (s) => {
                    const isFav = await isFavorited(s.id)
                    return { data: s, isFavorite: isFav }
                })
            )

            setScriptFavorite(results)
        }

        fetchFavorites()
    }, [script.data, setScriptFavorite])

    if (!script.success) {
        return <p className="text-center">{script.error}</p>
    }

    if (!userProfile) return <div>Loading...</div>

    const handleCreateScript = async () => {
        const result = await createScript(userProfile.user_id)
        setToastMessage(result)
    }

    return (
        <section className="pt-pcvw-[150] max-md:pt-32-sp">
            <div className="w-pcvw-[1280] mx-auto max-md:w-auto max-md:mx-16-sp">
                <div className="w-full">
                    <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                        <InfoIcon size="16" strokeWidth={2} />
                        リリース準備（R1・R2・A・B
                        完了：残りは本番環境とリリース直前の確認）
                        <br />
                        【C 本番環境（後で）】
                        <br />
                        ーC-1 Supabase本番プロジェクトを新規作成 → supabase db
                        push → planデータを本番価格IDで登録
                        <br />
                        ーC-2 Supabase本番：Site URL／Redirect
                        URLs、カスタムSMTP、「Confirm
                        email」をOFF、メールテンプレート（recovery）を貼り付け
                        <br />
                        ーC-3
                        Stripe本番：商品・価格の作成、Webhookエンドポイント登録、Revenue
                        recovery（再請求・失敗メール）設定、公開情報に規約URLを設定
                        <br />
                        ーC-4
                        Vercel環境変数：NEXT_PUBLIC_APP_URL、Stripe／Supabaseの本番キー（SERVICE_ROLE_KEYにNEXT_PUBLIC_を付けない）
                        <br />
                        【D リリース直前の確認】
                        <br />
                        ーD-1 next buildが通ることを確認
                        <br />
                        ーD-2
                        本番相当環境で手動テストチェックリスト（docs/stripe_manual_test_checklist.xlsx）を全件実施
                        <br />
                        ーD-3 この画面のタスクメモ（InfoIcon）を削除
                        <br />
                        【E 余裕があれば】
                        <br />
                        ーE-1 Webhookの絵文字入りconsole.logを整理
                        <br />
                        ーE-2
                        エラー監視（Sentry等）を導入し、Webhook処理失敗に気づけるようにする
                        <br />
                        ーE-3
                        ProfileCard：userPlanがnullの時は台本数を表示しない
                        <br />
                        ーE-4 Lockアイコンにaria-labelを付ける
                        <br />
                        ーE-5 actions.tsをリファクタリング
                        <br />
                        【E SEO関連】
                        <br />
                        ーE-6
                        favicon・アイコン：app/favicon.ico（現在Next.jsの初期アイコン）を差し替え、app/icon.png・app/apple-icon.png
                        を追加
                        <br />
                        ーE-7 metaタグ：app/layout.tsx の title・description
                        が「Next.js and Supabase Starter Kit」のまま →
                        サービス名に変更し title.template を設定。metadataBase
                        を本番ドメインに。各ページに title・description
                        を設定（ログイン後のページは robots:
                        noindex）※ルートのtitleはリリース前に必須
                        <br />
                        ーE-8 OGP・Twitterカード：openGraph／twitter
                        のメタデータと
                        app/opengraph-image（SNSでシェアされたときの画像）を設定
                        <br />
                        ーE-9 GTM（Google Tag Manager）／GA4
                        の導入（@next/third-parties）。導入する場合はプライバシーポリシーの「Cookie」「取得する情報」にアクセス解析の記載を追加
                        <br />
                        ーE-10 app/sitemap.ts と app/robots.ts
                        を作成（/protected 配下・認証ページはクロール対象外）
                    </div>
                </div>

                <h1
                    className={cn(
                        'text-heading-h1-pc max-md:text-heading-h1-sp',
                        // SP: 空状態の見出しは1行に収まるようH2サイズにする
                        sortedScripts.length === 0 &&
                            'max-md:text-heading-h2-sp'
                    )}
                >
                    {sortedScripts.length > 0
                        ? '台本一覧'
                        : '台本を作成してみましょう！'}
                </h1>

                <div className="flex items-center gap-x-16-pc max-md:gap-x-16-sp max-md:flex-wrap max-md:gap-y-12-sp mt-24-pc max-md:mt-24-sp">
                    {isLimitReached ? (
                        <Button size="default" variant={'default'} asChild>
                            <Link href="/plan">プランをアップグレード</Link>
                        </Button>
                    ) : (
                        <Button
                            size="default"
                            variant={'default'}
                            onClick={() => {
                                handleCreateScript()
                            }}
                        >
                            新規作成
                        </Button>
                    )}
                    {sortedScripts.length > 0 && (
                        <SortButton
                            sortCategory={sortCategory}
                            sortOrder={sortOrder}
                            onChangeCategory={setSortCategory}
                            onChangeOrder={setSortOrder}
                        />
                    )}
                </div>
                {isLimitReached && (
                    <div className="text-text-secondary text-sm mt-4">
                        台本の作成上限に達しています。プランをアップグレードしてください。
                    </div>
                )}

                <div className="flex flex-wrap gap-y-40-pc gap-x-24-pc mt-48-pc max-md:flex-col max-md:gap-y-24-sp max-md:mt-24-sp">
                    {sortedScripts.length > 0 ? (
                        sortedScripts.map((item) => {
                            return (
                                <ScriptCard
                                    key={item.data['id']}
                                    scriptInfo={item}
                                    className="w-pcvw-[302] max-md:w-full"
                                    setToastMessage={setToastMessage}
                                />
                            )
                        })
                    ) : (
                        <div
                            className="aspect-[302/322] cursor-pointer rounded-lg-pc border-border border-dashed border-[2px] p-24-pc max-md:p-24-sp flex items-center justify-center flex-col gap-y-12-pc max-md:gap-y-12-sp w-pcvw-[302] max-md:w-full max-md:aspect-auto max-md:h-spvw-[322] max-md:rounded-xl-sp max-md:border-border-strong"
                            onClick={() => {
                                handleCreateScript()
                            }}
                        >
                            <Plus size="48" strokeWidth={2} />
                            <p className="text-heading-h3-pc max-md:text-heading-h3-sp text-center">
                                新規作成
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {toastMessage && (
                <ToastMessage
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </section>
    )
}
