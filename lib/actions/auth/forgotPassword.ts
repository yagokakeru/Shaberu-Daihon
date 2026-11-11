'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

import { forgotPasswordFormValues } from '@/lib/validation/schema'

export const forgotPasswordAction = async (
    formData: forgotPasswordFormValues
): Promise<Message> => {
    const email = formData.email
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    if (!origin) {
        return {
            messageType: 'error',
            message: MESSAGES.INVALID_ACCESS,
        }
    }

    if (!email) {
        return {
            messageType: 'error',
            message: MESSAGES.EMAIL_REQUIRED,
        }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    })

    if (error) {
        console.error(error)
        return {
            messageType: 'error',
            message: MESSAGES.RESET_LINK_SEND_FAILED,
        }
    }

    return {
        messageType: 'success',
        message: MESSAGES.RESET_LINK_SENT,
    }
}
