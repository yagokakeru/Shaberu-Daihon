'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signUpAction } from '@/lib/actions/auth/signUp'
import { signInAction } from '@/lib/actions/auth/signIn'
import { forgotPasswordAction } from '@/lib/actions/auth/forgotPassword'
import { resetPasswordAction } from '@/lib/actions/auth/resetPassword'
import {
    signupSchema,
    signupFormValues,
    loginSchema,
    loginFormValues,
    forgotPasswordSchema,
    forgotPasswordFormValues,
    passwordResetSchema,
    passwordResetFormValues,
    profileSchema,
    profileFormValues,
    editScriptSchema,
    editScriptFormValues,
} from './schema'
import { useAtomValue } from 'jotai'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { updateProfile } from '@/lib/actions/auth/updateProfile'
import { editScript } from '@/lib/actions/script/editScript'

import type { scriptData } from '@/types/script'
import type { Message } from '@/types/message'

export function useSignupForm() {
    const form = useForm<signupFormValues>({
        resolver: zodResolver(signupSchema), // ZodをRHFに接続
    })

    const onSubmit = async (data: signupFormValues): Promise<Message> => {
        return await signUpAction(data)
    }

    return { form, onSubmit }
}

export function useLoginForm() {
    const form = useForm<loginFormValues>({
        resolver: zodResolver(loginSchema), // ZodをRHFに接続
    })

    const onSubmit = async (data: loginFormValues): Promise<Message> => {
        return await signInAction(data)
    }

    return { form, onSubmit }
}

export function useForgetPasswordForm() {
    const form = useForm<forgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema), // ZodをRHFに接続
    })

    const onSubmit = async (
        data: forgotPasswordFormValues
    ): Promise<Message> => {
        return await forgotPasswordAction(data)
    }

    return { form, onSubmit }
}

export function usePasswordResetForm() {
    const form = useForm<passwordResetFormValues>({
        resolver: zodResolver(passwordResetSchema), // ZodをRHFに接続
    })

    const onSubmit = async (
        data: passwordResetFormValues
    ): Promise<Message> => {
        return await resetPasswordAction(data)
    }

    return { form, onSubmit }
}

export function useProfileFrom() {
    const userProfile = useAtomValue(userProfileAtom)

    const form = useForm<profileFormValues>({
        resolver: zodResolver(profileSchema), // ZodをRHFに接続
        defaultValues: {
            name: userProfile?.name,
        },
    })

    const onSubmit = async (data: profileFormValues): Promise<Message> => {
        return await updateProfile(data, userProfile!.user_id)
    }

    return { form, onSubmit }
}

export function useEditScriptForm(initialData: scriptData | undefined) {
    const form = useForm<editScriptFormValues>({
        resolver: zodResolver(editScriptSchema), // ZodをRHFに接続
        defaultValues: {
            name: initialData?.title ?? '無題の台本',
            content: initialData?.content,
            plainContent: initialData?.plain_content ?? null,
        },
    })

    const onSubmit = async (data: editScriptFormValues): Promise<Message> => {
        // action serverに受け渡すときにjsonのattrsが消え、fontsizeが保持されないので一度文字列にする
        const jsonS = JSON.stringify(data.content, null, 2)

        return await editScript(data, jsonS, initialData?.id ?? 0)
    }

    return { form, onSubmit }
}
