/**
 * Stripe Webhookのエンドポイント
 */
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { stripeClient } from '@/utils/stripe/server'
import Stripe from 'stripe'

import {
    Subscription,
    UpgradeSubscriptionWithWebhook,
} from '@/lib/actions/stripe/subscription'
import { UnsubscriptionWebhook } from '@/lib/actions/stripe/unsubscription'

// Stripeクライアントを作成
const stripe = stripeClient()

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const headersList = await headers()
        const sig = headersList.get('stripe-signature')

        if (!sig) {
            return new Response('No signature', { status: 400 })
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(
                body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
        } catch (err) {
            console.error('Webhook signature verification failed.', err)
            return new Response('Webhook Error', { status: 400 })
        }

        console.log('[stripe-webhook]', event.type, event.id)

        // イベント処理
        // イベントの種類と役割：https://docs.stripe.com/api/events/types
        switch (event.type) {
            case 'customer.subscription.created':
                await Subscription(event)
                break
            case 'customer.subscription.updated':
                await UpgradeSubscriptionWithWebhook(event)
                break
            case 'customer.subscription.deleted':
                await UnsubscriptionWebhook(event.data.object.id)
                break
            default:
        }
    } catch (error) {
        console.error('Error handling webhook event:', error)
        return new Response('Webhook Handler Error', { status: 500 })
    }

    return new Response('ok', { status: 200 })
}
