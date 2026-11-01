/**
 * キャッシュされた編集用台本を取得する関数
 * getEditScript 関数をキャッシュして効率的に取得する
 */
import { cache } from 'react'
import { getEditScript } from '@/lib/actions/script/getScript'

export const getCachedEditScript = cache(getEditScript)
