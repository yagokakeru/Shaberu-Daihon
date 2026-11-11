'use server'

import type { Message } from '@/types/message'
import { MESSAGES } from '@/lib/consts/messages'
import { createClient } from '@/utils/supabase/server'

import {
    passwordResetFormValues,
    passwordResetSchema,
} from '@/lib/validation/schema'

export const resetPasswordAction = async (
    formData: passwordResetFormValues
): Promise<Message> => {
    const supabase = await createClient()

    const parsed = passwordResetSchema.safeParse(formData)

    if (!parsed.success) {
        return {
            messageType: 'error',
            message: parsed.error.issues[0].message,
        }
    }

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.newPassword,
    })

    if (error) {
        return {
            messageType: 'error',
            message: MESSAGES.PASSWORD_UPDATE_FAILED,
        }
    }

    return {
        messageType: 'success',
        message: MESSAGES.PASSWORD_UPDATE_SUCCEEDED,
    }
}
