'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { stripeClient } from '@/utils/stripe/server'

import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { checkout } from '@/lib/actions/stripe/checkout'

import { signupSchema, signupFormValues } from '@/lib/validation/schema'

export const signUpAction = async (
    formData: signupFormValues
): Promise<Message> => {
    const validationResult = signupSchema.safeParse(formData)
    if (!validationResult.success) {
        return { messageType: 'error', message: MESSAGES.SIGN_UP_INVALID_INPUT }
    }

    const priceID = formData.priceid
    const email = formData.email
    const password = formData.password
    const supabase = await createClient()
    const supabaseAdmin = createClientAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    // Stripeクライアントを作成
    const stripe = stripeClient()

    // ユーザー作成をロールバックする関数
    const rollbackSignUp = async (userId: string, stripe_uuid?: string) => {
        try {
            await supabase.auth.signOut() // supabase.auth.signUpで発行されたsessionを削除するためにサインアウト
            await supabaseAdmin.auth.admin.deleteUser(userId) // supabase authユーザー情報削除
            if (stripe_uuid) {
                await stripe.customers.del(stripe_uuid) // stripe顧客情報削除
            }
        } catch (rollbackError) {
            console.error('ロールバック失敗:', rollbackError)
        }
    }

    // ユーザーを作成
    const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
    })

    if (signUpError) {
        console.error(signUpError)
        return {
            messageType: 'error',
            message:
                signUpError.code == 'user_already_exists'
                    ? MESSAGES.USER_ALREADY_EXISTS
                    : MESSAGES.SIGN_UP_FAILED,
        }
    }

    // Stripeの顧客情報を作成
    if (data.user) {
        let customer
        try {
            customer = await stripe.customers.create({
                email: data.user.email,
            })
        } catch (stripeError) {
            console.error(stripeError)
            // ユーザー作成をロールバック
            await rollbackSignUp(data.user.id)
            return {
                messageType: 'error',
                message: MESSAGES.SIGN_UP_FAILED,
            }
        }

        // SupabeseとStripeのユーザIDをDBに挿入
        const { error: profileError } = await supabaseAdmin
            .from('profile')
            .insert({
                stripe_uuid: customer.id,
                supabase_uuid: data.user.id,
                email: data.user.email,
            })
        if (profileError) {
            await rollbackSignUp(data.user.id, customer.id) // ユーザー作成をロールバック
            console.error(profileError)
            return {
                messageType: 'error',
                message: MESSAGES.SIGN_UP_FAILED,
            }
        }

        const { data: planData, error: planError } = await supabaseAdmin
            .from('plan')
            .select('id')
            .is('stripe_price_id', null) // priceIDがnullのプランを取得
            .single()

        if (planError) {
            await supabaseAdmin
                .from('profile')
                .delete()
                .eq('supabase_uuid', data.user.id) // supabase profile情報削除
            await rollbackSignUp(data.user.id, customer.id) // ユーザー作成をロールバック

            console.error(planError)
            return {
                messageType: 'error',
                message: MESSAGES.SIGN_UP_FAILED,
            }
        }

        const { error: subError } = await supabaseAdmin
            .from('subscription')
            .insert({
                plan_id: planData.id,
                user_id: data.user.id,
                stripe_customer_id: customer.id,
                stripe_subscription_id: null,
                price_id: null,
                status: 'active',
                current_period_end: null,
                cancel_at_period_end: false,
            })
            .select()

        if (subError) {
            await supabaseAdmin
                .from('profile')
                .delete()
                .eq('supabase_uuid', data.user.id) // supabase profile情報削除
            await rollbackSignUp(data.user.id, customer.id) // ユーザー作成をロールバック

            console.error(subError)
            return {
                messageType: 'error',
                message: MESSAGES.SIGN_UP_FAILED,
            }
        }
    }

    // priceIDがあったらプランを購入する新規ユーザー
    if (priceID) {
        // ログインユーザー情報を取得
        const userData = await getUserInfo()

        if (userData) {
            return checkout(priceID)
        } else {
            return {
                messageType: 'error',
                message: MESSAGES.USER_INFO_FETCH_FAILED,
            }
        }
    }

    return redirect('/protected')
}
