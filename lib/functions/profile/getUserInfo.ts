/**
 * ユーザープロフィールを返す関数
 */
import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'

export const getUserInfo = cache(
    async function getUserInfo(): Promise<userProfile | null> {
        // supabaseクライアントを作成
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return null
        }

        const userData = await supabase
            .from('user_with_profile')
            .select()
            .eq('user_id', user.id) // supabase ユーザーのprofile情報取得
            .single()

        return userData.data
    }
)
