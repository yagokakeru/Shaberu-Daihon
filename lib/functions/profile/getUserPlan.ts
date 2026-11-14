/**
 * ユーザーの契約中のプラン情報を返す関数
 */
import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import type { userPlan } from '@/types/userPlan'

export const getUserPlan = cache(
    async function getUserPlan(): Promise<userPlan | null> {
        // supabaseクライアントを作成
        const supabase = await createClient()

        // 1. ログインユーザーIDを取得
        const {
            data: { user },
        } = await supabase.auth.getUser()
        const userID = user ? user.id : ''

        // 2. 契約中のサブスク情報を取得
        const { data: subData, error: subError } = await supabase
            .from('subscription')
            .select()
            .eq('user_id', userID)
            .single()

        if (subError) {
            console.error('Error fetching subscription data:', subError)
            return null
        }

        // 3. プラン情報を取得
        const { data: planData, error: planError } = await supabase
            .from('plan')
            .select()
            .eq('id', subData.plan_id)
            .single()

        if (planError) {
            console.error('Error fetching plan data:', planError)
            return null
        }

        // 4. 台本数を取得
        const { count: scriptCount, error: scriptError } = await supabase
            .from('script')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userID)

        if (scriptError) {
            console.error('Error fetching script count:', scriptError)
            return null
        }

        // 4. サブスク情報とプラン情報をマージして返す
        const result = Object.assign(subData, planData, {
            script_count: scriptCount ?? 0,
        })

        return result || null
    }
)
