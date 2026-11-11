'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { loginFormValues } from '@/lib/validation/schema'

export const signInAction = async (
    formData: loginFormValues
): Promise<Message> => {
    const email = formData.email
    const password = formData.password

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message: MESSAGES.SIGN_IN_FAILED,
        }
    }

    return redirect('/protected')
}
