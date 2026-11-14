'use server'

import { createClient } from '@/utils/supabase/server'
import { getActiveScriptIds } from '@/lib/actions/script/getActiveScriptIds'
import { isScriptLocked } from '@/lib/functions/script/isScriptLocked'
import type { script } from '@/types/script'

/**
 *
 * @returns ユーザーの台本の配列またはエラー情報
 * ユーザーの台本を取得する
 */
export const getAllScript = async (): Promise<script> => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const userID = user?.id

    // ユーザーの台本を取得する
    const { data: script, error } = await supabase
        .from('script')
        .select('*, script_favorites(id)')
        .eq('user_id', userID)

    if (error) {
        console.error(error)
        return { success: false, error: '台本の取得に失敗しました。' }
    }

    const scripts = script.map(({ script_favorites, ...s }) => ({
        ...s,
        isFavorite: script_favorites?.length > 0,
    }))

    let activeScriptIds: Set<number> | null = null

    try {
        activeScriptIds = await getActiveScriptIds()
    } catch (error) {
        console.error('アクティブな台本IDの取得に失敗:', error)
        activeScriptIds = null
    }

    scripts.forEach((s) => {
        s.isLocked = activeScriptIds ? !activeScriptIds.has(s.id) : false
    })

    return { success: true, data: scripts }
}

/**
 *
 * @param id 指定する台本のID
 * @returns
 * 指定したIDの台本を取得する
 */
export const getEditScript = async (id: string) => {
    const locked = await isScriptLocked(Number(id))
    if (locked) {
        return {
            success: false,
            error: 'この台本はロックされています。上位プランにアップデートしてください。',
        }
    }

    const supabase = await createClient()
    const { data: script, error } = await supabase
        .from('script')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(error)
        return { success: false, error: '台本の取得に失敗しました。' }
    }

    return { success: true, data: script }
}
