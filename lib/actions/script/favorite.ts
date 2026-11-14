'use server'

import { createClient } from '@/utils/supabase/server'
import type { userProfile } from '@/types/userProfile'

/**
 * お気に入りに登録
 * @param scriptID
 * @param userID
 */
export const insertFavorite = async (
    scriptID: number,
    userID: userProfile['user_id']
) => {
    const supabase = await createClient()

    const { error } = await supabase.from('script_favorites').insert({
        script_id: scriptID,
        user_id: userID,
    })

    if (error) {
        console.error(error)
    }
}

/**
 * お気に入りを削除
 * @param scriptID
 * @param userID
 */
export const deleteFavorite = async (
    scriptID: number,
    userID: userProfile['user_id']
) => {
    const supabase = await createClient()

    const { error } = await supabase
        .from('script_favorites')
        .delete()
        .eq('script_id', scriptID)
        .eq('user_id', userID)

    if (error) {
        console.error(error)
    }
}
