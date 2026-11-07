import {
    LegalPage,
    LegalSection,
    LegalList,
} from '@/components/app/legal/legal-page'
import { LEGAL } from '@/lib/consts/legal'

export const metadata = {
    title: `プライバシーポリシー`,
    description: 'しゃべる台本のプライバシーポリシーです。',
}

export default function PrivacyPage() {
    return (
        <LegalPage
            title="プライバシーポリシー"
            enactedAt={LEGAL.ENACTED_AT}
            revisedAt={LEGAL.PRIVACY_REVISED_AT}
        >
            <p className="text-body-default-pc max-md:text-body-default-sp">
                {LEGAL.SERVICE_NAME}
                の運営者（以下「運営者」といいます）は、サービス「
                {LEGAL.SERVICE_NAME}
                」（以下「本サービス」といいます）における個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
            </p>

            <LegalSection title="1. 取得する情報">
                <p>
                    運営者は、本サービスの提供にあたり、以下の情報を取得します。
                </p>
                <LegalList
                    items={[
                        'アカウント情報：メールアドレス、パスワード（暗号化して保存し、運営者が平文で知ることはありません）',
                        'プロフィール情報：ユーザーが登録した名前、アバター画像',
                        'ユーザーが作成したコンテンツ：台本のタイトル・本文、お気に入りの設定',
                        '契約・決済に関する情報：ご利用中のプラン、契約状況、決済代行サービス上の顧客ID',
                        'アクセス情報：IPアドレス、ブラウザの種類、アクセス日時などの通信記録、およびログイン状態を保持するためのCookie',
                        '利用状況に関する情報：閲覧したページ、参照元、ご利用の端末・ブラウザの種類、おおよその地域など、アクセス解析ツール（Google アナリティクス）がCookieを通じて取得する情報',
                        'エラー情報：本サービスで不具合が発生した際の、エラーの内容、発生したページ、ご利用の端末・ブラウザの種類、エラー発生直前の画面操作の記録（画面上の文字や入力内容は伏せた状態で記録します）などの情報',
                    ]}
                />
                <p>
                    なお、クレジットカード番号などのカード情報は、決済代行サービス（Stripe）が直接取得・管理しており、運営者のサーバーには保存されません。
                </p>
            </LegalSection>

            <LegalSection title="2. 利用目的">
                <p>運営者は、取得した情報を以下の目的で利用します。</p>
                <LegalList
                    items={[
                        '本サービスの提供・運営（ログイン、台本の保存・表示など）のため',
                        '有料プランの決済、契約の管理のため',
                        'パスワード再設定など、本サービスの利用に必要なご連絡のため',
                        'お問い合わせへの対応のため',
                        '利用規約に違反する行為や不正利用への対応のため',
                        '本サービスの利用状況の分析のため',
                        '本サービスの改善、障害の調査・対応のため',
                    ]}
                />
            </LegalSection>

            <LegalSection title="3. 第三者への提供">
                <p>
                    運営者は、次の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
                </p>
                <LegalList
                    items={[
                        '法令に基づく場合',
                        '人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき',
                        '国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合',
                        '次項に定める業務委託に伴って提供する場合',
                    ]}
                />
            </LegalSection>

            <LegalSection title="4. 外部サービスへの委託">
                <p>
                    運営者は、本サービスの提供に必要な範囲で、以下の外部サービスに個人情報の取り扱いを委託しています。
                </p>
                <LegalList
                    items={[
                        'Supabase（Supabase, Inc.／米国）：アカウント情報、プロフィール情報、台本などのデータの保存および認証',
                        'Stripe（Stripe, Inc.／米国）：有料プランの決済、カード情報の管理',
                        'Vercel（Vercel Inc.／米国）：本サービスのホスティング、アクセス情報の処理',
                        'Google（Google LLC／米国）：アクセス解析（Google アナリティクス）による利用状況の分析',
                        'Sentry（Functional Software, Inc.／米国）：エラー情報の収集・分析による不具合の調査',
                    ]}
                />
                <p>
                    これらの事業者は米国の企業であり、個人情報が日本国外のサーバーで取り扱われる場合があります。米国の個人情報保護に関する制度については、
                    <a
                        href="https://www.ppc.go.jp/personalinfo/legal/kaiseihogohou/#gaikoku"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        個人情報保護委員会のウェブサイト
                    </a>
                    をご参照ください。運営者は、各事業者が個人情報の保護のために必要な措置を講じていることを確認したうえで委託しています。
                </p>
            </LegalSection>

            <LegalSection title="5. 安全管理措置">
                <p>
                    運営者は、個人情報の漏えい、滅失またはき損を防止するため、通信の暗号化、アクセス権限の制限、データベースのアクセス制御などの安全管理措置を講じます。
                </p>
            </LegalSection>

            <LegalSection title="6. 個人情報の保存期間と削除">
                <LegalList
                    items={[
                        '運営者は、ユーザーがアカウントを保有している間、個人情報を保存します。',
                        'ユーザーがアカウントを削除した場合、アカウント情報および作成した台本などのデータを削除します。',
                        'ただし、決済代行サービスが法令に基づき保存する決済の記録については、当該事業者の定めに従って保存される場合があります。',
                    ]}
                />
            </LegalSection>

            <LegalSection title="7. 開示・訂正・利用停止等の請求">
                <p>
                    ユーザーは、運営者が保有するご自身の個人情報について、開示、訂正、追加、削除、利用の停止または第三者への提供の停止を請求することができます。ご請求の際は、下記のお問い合わせ窓口までご連絡ください。ご本人であることを確認したうえで、法令に従い遅滞なく対応します。
                </p>
                <p>
                    なお、名前・アバター画像の変更、アカウントの削除は、マイページからいつでも行うことができます。
                </p>
            </LegalSection>

            <LegalSection title="8. Cookieについて">
                <p>本サービスは、以下の目的でCookieを使用します。</p>
                <LegalList
                    items={[
                        'ログイン状態の保持',
                        'Google アナリティクスによる利用状況の分析',
                    ]}
                />
                <p>
                    Google
                    アナリティクスは、Cookieを使用して、閲覧したページ、アクセス日時、ご利用の端末・ブラウザの種類などの情報をGoogle
                    LLCに送信します。運営者は、氏名やメールアドレスなど個人を特定できる情報をGoogle
                    アナリティクスに送信しません。Googleによるデータの取り扱いについては、
                    <a
                        href="https://policies.google.com/technologies/partner-sites?hl=ja"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用
                    </a>
                    をご参照ください。
                </p>
                <p>
                    Google アナリティクスによる情報の収集は、
                    <a
                        href="https://tools.google.com/dlpage/gaoptout?hl=ja"
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Google アナリティクス オプトアウト アドオン
                    </a>
                    を利用することで無効にできます。また、ブラウザの設定によりCookieを無効にすることもできますが、その場合、本サービスにログインできなくなります。
                </p>
            </LegalSection>

            <LegalSection title="9. 本ポリシーの変更">
                <p>
                    運営者は、法令の変更や本サービスの内容の変更に応じて、本ポリシーを変更することがあります。重要な変更を行う場合は、本サービス上での掲示その他適切な方法によりお知らせします。
                </p>
            </LegalSection>

            <LegalSection title="10. お問い合わせ窓口">
                <p>
                    本ポリシーに関するお問い合わせ、個人情報の開示等のご請求は、以下までご連絡ください。
                </p>
                <p>
                    {LEGAL.SERVICE_NAME} 運営者
                    <br />
                    メールアドレス：
                    <a
                        href={`mailto:${LEGAL.CONTACT_EMAIL}`}
                        className="underline"
                    >
                        {LEGAL.CONTACT_EMAIL}
                    </a>
                </p>
            </LegalSection>
        </LegalPage>
    )
}
