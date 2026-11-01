import Link from 'next/link'
import { LegalPage, LegalTable } from '@/components/app/legal/legal-page'
import { getPlan } from '@/lib/functions/plan/getPlan'
import { LEGAL, LEGAL_PATHS } from '@/lib/consts/legal'

export const metadata = {
    title: `特定商取引法に基づく表記`,
}

export default async function TokushohoPage() {
    const planInfo = await getPlan()

    // 有料プランの価格はStripeの価格情報から表示する（価格を変更しても表記がずれないように）
    const paidPlans = planInfo.ok
        ? planInfo.data.filter((plan) => plan.priceId)
        : []

    const price = (
        <>
            {paidPlans.length > 0 && (
                <ul>
                    {paidPlans.map((plan) => (
                        <li key={plan.id}>
                            {plan.name}：{plan.interval}額{' '}
                            {plan.amount.toLocaleString('ja-JP')}円（税込）
                        </li>
                    ))}
                </ul>
            )}
            <p>
                各プランの料金・内容は
                <Link href="/plan" className="underline">
                    プランページ
                </Link>
                に表示しています。
            </p>
        </>
    )

    const rows = [
        {
            label: '販売事業者',
            content: `${LEGAL.SERVICE_NAME}（個人運営）`,
        },
        { label: '運営統括責任者', content: LEGAL.DISCLOSE_ON_REQUEST },
        { label: '所在地', content: LEGAL.DISCLOSE_ON_REQUEST },
        { label: '電話番号', content: LEGAL.DISCLOSE_ON_REQUEST },
        {
            label: 'メールアドレス',
            content: (
                <a href={`mailto:${LEGAL.CONTACT_EMAIL}`} className="underline">
                    {LEGAL.CONTACT_EMAIL}
                </a>
            ),
        },
        { label: 'サービスURL', content: LEGAL.SERVICE_URL },
        { label: '販売価格', content: price },
        {
            label: '商品代金以外の必要料金',
            content:
                'サービスの利用に必要なインターネット接続料金・通信料金は、お客様のご負担となります。',
        },
        { label: '支払方法', content: 'クレジットカード決済（Stripe）' },
        {
            label: '支払時期',
            content:
                '初回はお申し込み時に決済されます。以降は毎月の契約更新日に自動で決済されます。',
        },
        {
            label: 'サービスの提供時期',
            content: '決済完了後、直ちにご利用いただけます。',
        },
        {
            label: '契約期間・自動更新',
            content:
                '契約期間は1か月です。解約のお手続きをされない限り、契約期間の終了日に同じプランで自動更新されます。',
        },
        {
            label: '解約について',
            content:
                'マイページの「プランを解約する」から、いつでも解約できます。解約後も契約期間の終了日までは引き続きご利用いただけます。契約期間の途中で解約された場合も、日割りでの返金は行いません。',
        },
        {
            label: 'プラン変更について',
            content:
                '有料プラン間でプランを変更した場合、料金の差額を日割りで計算します。上位プランへの変更時は差額を変更時に請求し、下位プランへの変更時は差額を次回以降のご請求から差し引きます。',
        },
        {
            label: '返品・キャンセルについて',
            content:
                'デジタルサービスの性質上、決済完了後の返品・キャンセル・返金には応じられません（法令に定める場合を除きます）。',
        },
        {
            label: '動作環境',
            content:
                'Google Chrome・Safari・Microsoft Edge・Firefox の最新版でのご利用を推奨します。',
        },
    ]

    return (
        <LegalPage
            title="特定商取引法に基づく表記"
            enactedAt={LEGAL.ENACTED_AT}
        >
            <LegalTable rows={rows} />
            <p className="text-body-small-pc max-md:text-body-small-sp">
                サービスのご利用条件は
                <Link href={LEGAL_PATHS.TERMS} className="underline">
                    利用規約
                </Link>
                を、個人情報の取り扱いは
                <Link href={LEGAL_PATHS.PRIVACY} className="underline">
                    プライバシーポリシー
                </Link>
                をご確認ください。
            </p>
        </LegalPage>
    )
}
