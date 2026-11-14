'use server'

import { redirect } from 'next/navigation'
import { stripeClient } from '@/utils/stripe/server'
import { createClient } from '@/utils/supabase/server'
import { getUserPlan } from '@/lib/functions/profile/getUserPlan'

import type { Message } from '@/types/message'

// Stripeクライアントを作成
const stripe = stripeClient()

export const checkout = async (newPriceID: string): Promise<Message> => {
    const userPlan = await getUserPlan()

    if (!userPlan) {
        return {
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        }
    }

    if (userPlan.stripe_subscription_id) {
        return {
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        }
    }

    const supabase = await createClient()
    const { data: planData, error: planError } = await supabase
        .from('plan')
        .select('id')
        .eq('stripe_price_id', newPriceID)
        .is('is_active', true)
        .single()

    if (planError || !planData) {
        return {
            messageType: 'error',
            message:
                'プラン情報の取得に失敗しました。時間をおいて再度お試しください。',
        }
    }

    let session
    // 決算を作成
    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: newPriceID,
                    quantity: 1,
                },
            ],
            customer: userPlan.stripe_customer_id,
            mode: 'subscription',
            subscription_data: {
                metadata: {
                    user_id: userPlan.user_id,
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/protected/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plan`,
            custom_text: {
                submit: {
                    message:
                        '1か月ごとに自動更新され、初回はお申し込み時、以降は毎月の更新日に自動で決済されます。' +
                        '解約はマイページからいつでも可能で、契約期間の終了日までご利用いただけます（途中解約による返金はありません）。',
                },
            },
            consent_collection: {
                terms_of_service: 'required',
            },
            allow_promotion_codes: true,
        })
    } catch (error) {
        console.error('Checkout error:', error)
        return {
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        }
    }

    if (session.url) {
        redirect(session.url)
    }

    return {
        messageType: 'error',
        message: '決済を開始できませんでした。時間をおいて再度お試しください。',
    }
}
