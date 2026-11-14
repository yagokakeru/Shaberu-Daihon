import type { JSONContent } from '@tiptap/react'

export type scriptData = {
    id: number
    user_id: string
    title: string
    content: JSONContent
    plain_content: string
    inserted_at: string
    updated_at: string
    isFavorite?: boolean
    isLocked?: boolean
}

export type script = {
    success: boolean
    data?: scriptData[]
    error?: string
}

export type getEditScript = {
    success: boolean
    data?: scriptData
    error?: string
}
