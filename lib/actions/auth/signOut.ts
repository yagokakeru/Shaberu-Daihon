'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const signOutAction = async (): Promise<Message> => {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message: MESSAGES.SIGN_OUT_FAILED,
        }
    }

    return redirect('/sign-in')
}
