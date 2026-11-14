'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import FeatureCard from './ui/card/feature'
import { Result } from '@/types/result'
import { planInfo } from '@/types/planInfo'
import PlanCard from '@/components/ui/card/plan'

export default function Home({ planInfo }: { planInfo: Result<planInfo[]> }) {
    return (
        <>
            <section className="pt-pcvw-[216] max-md:pt-56-sp max-md:px-16-sp max-md:pb-16-sp">
                <p className="text-heading-h1-pc text-center max-md:text-spvw-[26] max-md:leading-[1.4]">
                    カメラ目線のまま話せる
                    <br />
                    最もシンプルなプロンプター
                </p>
                <Button
                    asChild
                    className="mt-32-pc mx-auto w-fit max-md:mt-24-sp"
                >
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
                <Image
                    className="block rounded-xl-pc mx-auto mt-32-pc w-pcvw-[1000] max-md:w-full max-md:h-auto max-md:mt-24-sp max-md:rounded-xl-sp"
                    src="/home/main_img.jpg"
                    alt="しゃべる台本の台本一覧画面"
                    width={1000}
                    height={563}
                />
            </section>

            <section className="pt-128-pc max-md:pt-32-sp">
                <div className="w-pcvw-[1280] mx-auto max-md:w-auto max-md:mx-16-sp">
                    <h2 className="text-heading-h2-pc mb-48-pc max-md:text-heading-h2-sp max-md:mb-16-sp">
                        機能
                    </h2>
                    <div className="flex flex-wrap justify-space-between gap-x-24-pc gap-y-32-pc max-md:flex-col max-md:gap-y-16-sp">
                        <FeatureCard
                            title="📹 カメラ目線をキープ"
                            description="視線を外さず自然に話せる"
                            image="/home/feature_img01.jpg"
                            alt="ノートパソコンに表示した台本を見ながら、カメラに向かって話している様子"
                            className="w-pcvw-[618] max-md:w-full"
                        />
                        <FeatureCard
                            title="⚡ 自動スクロール"
                            description="話すスピードに合わせて自然にスクロール"
                            image="/home/feature_img02.jpg"
                            alt="プロンプター画面で台本が自動スクロールしている様子と、スクロール速度・開始タイマーの設定"
                            className="w-pcvw-[618] max-md:w-full"
                        />
                        <FeatureCard
                            title="🪞 鏡文字対応"
                            description="そのまま読める鏡文字表示"
                            image="/home/feature_img03.jpg"
                            alt="プロンプター画面と、上下反転・左右反転の表示切り替え"
                            className="w-pcvw-[618] max-md:w-full"
                        />
                        <FeatureCard
                            title="📜 台本を簡単作成"
                            description="思いついたらすぐ作れるシンプルな台本エディタ"
                            image="/home/feature_img04.jpg"
                            alt="台本エディタで文字を太字・イタリック体・色で装飾している画面"
                            className="w-pcvw-[618] max-md:w-full"
                        />
                    </div>
                </div>
            </section>

            <section className="pt-128-pc max-md:pt-32-sp">
                <div className="w-pcvw-[1280] mx-auto max-md:w-auto max-md:mx-16-sp">
                    <h2 className="text-heading-h2-pc mb-48-pc max-md:text-heading-h2-sp max-md:mb-24-sp">
                        プラン比較
                    </h2>
                    <div className="flex items-end justify-center gap-x-48-pc max-md:flex-col max-md:items-center max-md:gap-y-24-sp">
                        {planInfo.ok ? (
                            planInfo.data.map(
                                (item: planInfo, index: number) => {
                                    return (
                                        <PlanCard
                                            key={index}
                                            planInfo={item}
                                            className="w-pcvw-[300] max-md:w-spvw-[330]"
                                        />
                                    )
                                }
                            )
                        ) : (
                            <div className="text-body-default-pc max-md:text-body-default-sp">
                                プラン情報が取得できませんでした
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
