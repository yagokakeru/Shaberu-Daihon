'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { stripeClient } from '@/utils/stripe/server'

import { getUserInfo } from '@/lib/functions/profile/getUserInfo'

export const deleteAccountAction = async (): Promise<Message> => {
    const userInfo = await getUserInfo()

    if (userInfo) {
        const userID = userInfo.user_id
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

        try {
            await stripe.customers.del(userInfo.stripe_uuid) // stripe顧客情報削除
        } catch (error) {
            if (
                !(
                    error instanceof Stripe.errors.StripeError &&
                    error.code === 'resource_missing'
                )
            ) {
                console.error(
                    'stripeユーザー削除処理でエラー:',
                    `userID=${userID}`,
                    `stripe_uuid=${userInfo.stripe_uuid}`,
                    error
                )
                return {
                    messageType: 'error',
                    message: MESSAGES.DELETE_ACCOUNT_FAILED,
                }
            }
        }

        const { error: deleteUserError } =
            await supabaseAdmin.auth.admin.deleteUser(userID) // supabase authユーザー情報削除
        if (deleteUserError) {
            console.error(
                'supabaseユーザー削除処理でエラー:',
                `userID=${userID}`,
                deleteUserError
            )
            return {
                messageType: 'error',
                message: MESSAGES.DELETE_ACCOUNT_FAILED,
            }
        }

        await supabase.auth.signOut()
    } else {
        console.error('ユーザー情報が取得できませんでした。')
        return {
            messageType: 'error',
            message: MESSAGES.DELETE_ACCOUNT_FAILED,
        }
    }

    return redirect('/')
}
