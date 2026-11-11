import { describe, it, expect, vi, beforeEach } from 'vitest'
import { forgotPasswordAction } from '@/lib/actions/auth/forgotPassword'
import { signInAction } from '@/lib/actions/auth/signIn'
import { resetPasswordAction } from '@/lib/actions/auth/resetPassword'
import { signOutAction } from '@/lib/actions/auth/signOut'
import { signUpAction } from '@/lib/actions/auth/signUp'
import { deleteAccountAction } from '@/lib/actions/auth/deleteAccount'
import { createClient } from '@/utils/supabase/server'
import { createClient as createClientAdmin } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/functions/profile/getUserInfo'
import { checkout } from '@/lib/actions/stripe/checkout'

vi.mock('@/utils/supabase/server', () => ({
    createClient: vi.fn(),
}))
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(),
}))
vi.mock('next/headers', () => ({
    headers: vi.fn(),
}))
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))
vi.mock('@/lib/actions/stripe/checkout', () => ({
    checkout: vi.fn(),
}))
vi.mock('@/lib/functions/profile/getUserInfo', () => ({
    getUserInfo: vi.fn(),
}))

// new Stripe(...) は「呼ばれたらこのオブジェクトを返す」偽のコンストラクタに差し替える。
// customers.create/del の中身をテストごとに制御できるよう、
// 参照を外に出しておく(vi.mock内から参照する変数は"mock"始まりにする必要がある)
const mockCustomersCreate = vi.fn()
const mockCustomersDel = vi.fn()
// deleteAccountActionは `error instanceof Stripe.errors.StripeError` で判定するため、
// モックのStripeにもerrors.StripeErrorクラスを生やしておく
const { MockStripeError } = vi.hoisted(() => {
    class MockStripeError extends Error {
        code?: string
        constructor(code?: string) {
            super(code)
            this.code = code
        }
    }
    return { MockStripeError }
})
vi.mock('stripe', () => {
    const Stripe = vi.fn().mockImplementation(function () {
        return {
            customers: { create: mockCustomersCreate, del: mockCustomersDel },
        }
    })
    return {
        default: Object.assign(Stripe, {
            errors: { StripeError: MockStripeError },
        }),
    }
})

const mockHeaders = (origin: string | null = 'https://example.com') => {
    vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue(origin),
    } as unknown as Awaited<ReturnType<typeof headers>>)
}

const mockSupabase = (
    resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null })
) => {
    vi.mocked(createClient).mockResolvedValue({
        auth: { resetPasswordForEmail },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return resetPasswordForEmail
}

describe('forgotPasswordAction', () => {
    it('emailが空の場合はsupabaseを呼ばずにエラーを返す', async () => {
        mockHeaders()
        const resetPasswordForEmail = mockSupabase()

        const result = await forgotPasswordAction({ email: '' })

        expect(result).toEqual({
            messageType: 'error',
            message: 'メールアドレスを入力してください。',
        })
        expect(resetPasswordForEmail).not.toHaveBeenCalled()
    })

    it('originが取得できない場合はエラーを返す', async () => {
        mockHeaders(null)
        const resetPasswordForEmail = mockSupabase()

        const result = await forgotPasswordAction({ email: 'user@example.com' })

        expect(result).toEqual({
            messageType: 'error',
            message:
                '不正なアクセスです。しばらくしてからもう一度お試しください。',
        })
        expect(resetPasswordForEmail).not.toHaveBeenCalled()
    })

    it('supabaseがエラーを返した場合、エラーメッセージを返す', async () => {
        mockHeaders()
        mockSupabase(vi.fn().mockResolvedValue({ error: { message: 'boom' } }))

        const result = await forgotPasswordAction({
            email: 'user@example.com',
        })

        expect(result).toEqual({
            messageType: 'error',
            message:
                'パスワードのリセットリンクの送信に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('成功した場合、正しいredirectToでsupabaseを呼び、成功メッセージを返す', async () => {
        mockHeaders('https://example.com')
        const resetPasswordForEmail = mockSupabase()

        const result = await forgotPasswordAction({
            email: 'user@example.com',
        })

        expect(resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
            redirectTo:
                'https://example.com/auth/callback?redirect_to=/protected/reset-password',
        })
        expect(result).toEqual({
            messageType: 'success',
            message:
                'パスワードのリセットリンクを送信しました。メールをご確認ください。',
        })
    })
})

const mockSignInWithPassword = (
    signInWithPassword = vi.fn().mockResolvedValue({ error: null })
) => {
    vi.mocked(createClient).mockResolvedValue({
        auth: { signInWithPassword },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return signInWithPassword
}

describe('signInAction', () => {
    it('supabaseがエラーを返した場合、redirectは呼ばれずエラーメッセージを返す', async () => {
        mockSignInWithPassword(
            vi.fn().mockResolvedValue({ error: { message: 'invalid' } })
        )

        const result = await signInAction({
            email: 'user@example.com',
            password: 'Password1',
        })

        expect(result).toEqual({
            messageType: 'error',
            message:
                'ログインできませんでした。メールアドレスとパスワードを確認してください。',
        })
        expect(redirect).not.toHaveBeenCalled()
    })

    it('supabaseが成功した場合、/protectedへredirectする', async () => {
        const signInWithPassword = mockSignInWithPassword()

        await signInAction({
            email: 'user@example.com',
            password: 'Password1',
        })

        expect(signInWithPassword).toHaveBeenCalledWith({
            email: 'user@example.com',
            password: 'Password1',
        })
        expect(redirect).toHaveBeenCalledWith('/protected')
    })
})

const mockUpdateUser = (
    updateUser = vi.fn().mockResolvedValue({ error: null })
) => {
    vi.mocked(createClient).mockResolvedValue({
        auth: { updateUser },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return updateUser
}

describe('resetPasswordAction', () => {
    it('パスワードバリデーションに失敗した場合、supabaseを呼ばずにエラーメッセージを返す', async () => {
        const updateUser = mockUpdateUser()

        const result = await resetPasswordAction({
            newPassword: '',
            newPasswordConfirm: '',
        })

        expect(result).toEqual({
            messageType: 'error',
            message: 'パスワードは8文字以上で入力してください',
        })
        expect(updateUser).not.toHaveBeenCalled()
    })

    it('supabaseがエラーを返した場合、エラーメッセージを返す', async () => {
        mockUpdateUser(
            vi.fn().mockResolvedValue({ error: { message: 'boom' } })
        )

        const result = await resetPasswordAction({
            newPassword: 'Password1',
            newPasswordConfirm: 'Password1',
        })

        expect(result).toEqual({
            messageType: 'error',
            message: 'パスワードの更新に失敗しました。',
        })
    })

    it('supabaseが成功した場合、成功メッセージを返す', async () => {
        const updateUser = mockUpdateUser()

        const result = await resetPasswordAction({
            newPassword: 'Password1',
            newPasswordConfirm: 'Password1',
        })

        expect(result).toEqual({
            messageType: 'success',
            message: 'パスワードの更新に成功しました。',
        })
        expect(updateUser).toHaveBeenCalledWith({ password: 'Password1' })
    })
})

const mockSignOut = (signOut = vi.fn().mockResolvedValue({ error: null })) => {
    vi.mocked(createClient).mockResolvedValue({
        auth: { signOut },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return signOut
}

describe('signOutAction', () => {
    it('supabaseが成功した場合、/sign-inへredirectする', async () => {
        const signOut = mockSignOut()

        await signOutAction()

        expect(signOut).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('supabaseがエラーを返した場合、エラーメッセージを返す', async () => {
        const signOut = mockSignOut(
            vi.fn().mockResolvedValue({ error: { message: 'boom' } })
        )

        const result = await signOutAction()

        expect(signOut).toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message:
                'ログアウトに失敗しました。しばらくしてからもう一度お試しください。',
        })
    })
})

// テーブル名によって返す偽物を出し分ける
const mockFrom = vi.fn((table: string) => {
    if (table === 'profile') {
        return { insert: vi.fn().mockResolvedValue({ error: null }) }
    }
    if (table === 'plan') {
        return {
            select: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                        data: { id: 5 },
                        error: null,
                    }),
                }),
            }),
        }
    }
    if (table === 'subscription') {
        return {
            insert: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({ data: [{}], error: null }),
            }),
        }
    }
    throw new Error(`想定外のテーブル: ${table}`)
})

// RLSでユーザー本人の書き込みを禁止しているため、profile/plan/subscriptionへの
// アクセスはservice role（createClientAdmin）経由で行う。
// セッションのクライアントにはfromを持たせず、誤って本人権限で書き込むと落ちるようにしておく
const mockSignUpSupabase = ({
    signUp = vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signOut = vi.fn().mockResolvedValue({ error: null }),
    from = mockFrom,
} = {}) => {
    vi.mocked(createClient).mockResolvedValue({
        auth: { signUp, signOut },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    mockAdminSupabase(from)
    return { signUp, signOut, from }
}

describe('signUpAction', () => {
    it('正常に登録・ログインできた場合、Stripe顧客とDBレコードを作成し/protectedへredirectする', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })

        await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        // Stripe顧客が正しいemailで作成されたか
        expect(mockCustomersCreate).toHaveBeenCalledWith({
            email: 'new@example.com',
        })
        // profile/subscriptionへの書き込みがservice role（createClientAdmin）経由で行われたか
        expect(mockFrom).toHaveBeenCalledWith('profile')
        expect(mockFrom).toHaveBeenCalledWith('subscription')
        // 最終的に/protectedへredirectしたか
        expect(redirect).toHaveBeenCalledWith('/protected')
    })

    // 画面を経由せずServer Actionを直接呼ばれた場合に備え、サーバー側でもsignupSchemaで検証する
    it('emailかpasswordが空の場合、ユーザーを作成せずエラーメッセージを返す', async () => {
        const { signUp } = mockSignUpSupabase()

        const result = await signUpAction({
            priceid: null,
            email: '',
            password: '',
            consent: true,
        })

        expect(signUp).not.toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message: '入力内容に誤りがあります。',
        })
    })

    it('利用規約・プライバシーポリシーに同意していない場合、ユーザーを作成せずエラーメッセージを返す', async () => {
        const { signUp } = mockSignUpSupabase()

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: false,
        })

        expect(signUp).not.toHaveBeenCalled()
        expect(mockCustomersCreate).not.toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message: '入力内容に誤りがあります。',
        })
    })

    it('Stripe顧客の作成に失敗した場合、authユーザーをロールバックしてエラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        const { signOut } = mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
        })
        mockCustomersCreate.mockRejectedValue(new Error('stripe down'))

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        // Stripe顧客はまだ存在しないので削除は呼ばれない
        expect(mockCustomersDel).not.toHaveBeenCalled()
        // authユーザーの削除とセッションのサインアウトは行われる
        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('profileテーブルへの挿入でエラーが発生した場合、Stripe顧客とauthユーザーをロールバックしてエラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        const { signOut } = mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
            // 共有のmockFromを書き換えず、このテスト専用のfromを渡す
            from: vi.fn((table: string) => {
                if (table === 'profile') {
                    return {
                        insert: vi.fn().mockResolvedValue({
                            error: { message: 'DB error' },
                        }),
                    }
                }
                throw new Error(`想定外のテーブル: ${table}`)
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        expect(mockCustomersDel).toHaveBeenCalledWith('cus_123')
        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('freeプランの取得に失敗した場合、profile・Stripe顧客・authユーザーをロールバックしてエラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        const profileDeleteEq = vi.fn().mockResolvedValue({ error: null })
        const profileDelete = vi.fn().mockReturnValue({ eq: profileDeleteEq })
        const { signOut } = mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
            from: vi.fn((table: string) => {
                if (table === 'profile') {
                    return {
                        insert: vi.fn().mockResolvedValue({ error: null }),
                        delete: profileDelete,
                    }
                }
                if (table === 'plan') {
                    return {
                        select: vi.fn().mockReturnValue({
                            is: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({
                                    data: null,
                                    error: { message: 'plan not found' },
                                }),
                            }),
                        }),
                    }
                }
                throw new Error(`想定外のテーブル: ${table}`)
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        // profile行が削除されたか
        expect(profileDelete).toHaveBeenCalled()
        expect(profileDeleteEq).toHaveBeenCalledWith('supabase_uuid', 'user-1')
        expect(mockCustomersDel).toHaveBeenCalledWith('cus_123')
        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('subscriptionテーブルへの挿入でエラーが発生した場合、profile・Stripe顧客・authユーザーをロールバックしてエラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        const profileDeleteEq = vi.fn().mockResolvedValue({ error: null })
        const profileDelete = vi.fn().mockReturnValue({ eq: profileDeleteEq })
        const { signOut } = mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
            from: vi.fn((table: string) => {
                if (table === 'profile') {
                    return {
                        insert: vi.fn().mockResolvedValue({ error: null }),
                        delete: profileDelete,
                    }
                }
                if (table === 'plan') {
                    return {
                        select: vi.fn().mockReturnValue({
                            is: vi.fn().mockReturnValue({
                                single: vi.fn().mockResolvedValue({
                                    data: { id: 5 },
                                    error: null,
                                }),
                            }),
                        }),
                    }
                }
                if (table === 'subscription') {
                    return {
                        insert: vi.fn().mockReturnValue({
                            select: vi.fn().mockResolvedValue({
                                data: null,
                                error: { message: 'subscription error' },
                            }),
                        }),
                    }
                }
                throw new Error(`想定外のテーブル: ${table}`)
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        // profile行が削除されたか
        expect(profileDelete).toHaveBeenCalled()
        expect(profileDeleteEq).toHaveBeenCalledWith('supabase_uuid', 'user-1')
        expect(mockCustomersDel).toHaveBeenCalledWith('cus_123')
        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('supabaseのsignUpがuser_already_existsエラーを返した場合、専用メッセージを返す', async () => {
        mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: null },
                error: { code: 'user_already_exists' },
            }),
        })

        const result = await signUpAction({
            priceid: null,
            email: 'existing@example.com',
            password: 'Password1',
            consent: true,
        })

        expect(result).toEqual({
            messageType: 'error',
            message: 'ユーザーはすでに存在しています。',
        })
    })

    it('supabaseのsignUpがその他のエラーを返した場合、汎用エラーメッセージを返す', async () => {
        mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: null },
                error: { code: 'unexpected_error' },
            }),
        })

        const result = await signUpAction({
            priceid: null,
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })
    })

    it('priceIDがあり、ユーザー情報を取得できなかった場合、エラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })
        vi.mocked(getUserInfo).mockResolvedValue(null)

        const result = await signUpAction({
            priceid: 'price_123',
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        expect(result).toEqual({
            messageType: 'error',
            message:
                'ユーザー情報を取得できませんでした。しばらくしてからもう一度お試しください。',
        })
    })

    it('決済セッションの取得に失敗した場合、エラーメッセージを返す', async () => {
        const mockUser = { id: 'user-1', email: 'new@example.com' }
        mockSignUpSupabase({
            signUp: vi.fn().mockResolvedValue({
                data: { user: mockUser },
                error: null,
            }),
        })
        mockCustomersCreate.mockResolvedValue({ id: 'cus_123' })
        vi.mocked(getUserInfo).mockResolvedValue({
            user_id: 'user-1',
            email: 'new@example.com',
            created_at: '2024-01-01T00:00:00.000Z',
            profile_id: 1,
            stripe_uuid: 'cus_123',
            name: '',
            avatar_url: '',
        })
        vi.mocked(checkout).mockResolvedValue({
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        })

        const result = await signUpAction({
            priceid: 'price_123',
            email: 'new@example.com',
            password: 'Password1',
            consent: true,
        })

        // customer ID / user ID はcheckout内でセッションから取るので、渡すのは選んだpriceだけ
        expect(checkout).toHaveBeenCalledWith('price_123')
        expect(result).toEqual({
            messageType: 'error',
            message:
                '決済を開始できませんでした。時間をおいて再度お試しください。',
        })
    })
})

// 関連テーブルはDBのON DELETE CASCADEで消えるため、
// deleteAccountActionが使うのはsignOutだけ
const mockDeleteAccountSupabase = () => {
    const signOut = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockResolvedValue({
        auth: { signOut },
    } as unknown as Awaited<ReturnType<typeof createClient>>)
    return { signOut }
}

const mockAdminDeleteUser = vi.fn().mockResolvedValue({ error: null })
const mockAdminSupabase = (from?: ReturnType<typeof vi.fn>) => {
    vi.mocked(createClientAdmin).mockReturnValue({
        auth: { admin: { deleteUser: mockAdminDeleteUser } },
        from,
    } as unknown as ReturnType<typeof createClientAdmin>)
}

const mockLoginUser = () => {
    vi.mocked(getUserInfo).mockResolvedValue({
        user_id: 'user-1',
        stripe_uuid: 'cus_123',
    } as unknown as Awaited<ReturnType<typeof getUserInfo>>)
}

const DELETE_ACCOUNT_ERROR = {
    messageType: 'error',
    message:
        'ユーザー削除に失敗しました。しばらくしてからもう一度お試しください。',
}

describe('deleteAccountAction', () => {
    beforeEach(() => {
        // clearAllMocksでは実装が残るため、前のテストのmockRejectedValueなどを毎回上書きする
        mockCustomersDel.mockResolvedValue({})
        mockAdminDeleteUser.mockResolvedValue({ error: null })
    })

    it('ログインユーザーが取得できない場合、何も削除せずエラーメッセージを返す', async () => {
        vi.mocked(getUserInfo).mockResolvedValue(null)

        const result = await deleteAccountAction()

        expect(result).toEqual(DELETE_ACCOUNT_ERROR)
        expect(mockCustomersDel).not.toHaveBeenCalled()
        expect(mockAdminDeleteUser).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
    })

    it('正常に削除できた場合、Stripe顧客→authユーザーの順に削除し、サインアウトして/へredirectする', async () => {
        mockLoginUser()
        mockAdminSupabase()
        const { signOut } = mockDeleteAccountSupabase()

        await deleteAccountAction()

        expect(mockCustomersDel).toHaveBeenCalledWith('cus_123')
        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/')
    })

    it('Stripe顧客が既に削除済み(resource_missing)の場合、成功扱いで処理を続ける', async () => {
        mockLoginUser()
        mockAdminSupabase()
        const { signOut } = mockDeleteAccountSupabase()
        mockCustomersDel.mockRejectedValue(
            new MockStripeError('resource_missing')
        )

        await deleteAccountAction()

        expect(mockAdminDeleteUser).toHaveBeenCalledWith('user-1')
        expect(signOut).toHaveBeenCalled()
        expect(redirect).toHaveBeenCalledWith('/')
    })

    it('Stripe顧客の削除がresource_missing以外のStripeエラーの場合、authユーザーを削除せずエラーメッセージを返す', async () => {
        mockLoginUser()
        mockAdminSupabase()
        mockDeleteAccountSupabase()
        mockCustomersDel.mockRejectedValue(new MockStripeError('api_error'))

        const result = await deleteAccountAction()

        expect(result).toEqual(DELETE_ACCOUNT_ERROR)
        // 課金が残ったままアカウントだけ消える事故を防ぐ
        expect(mockAdminDeleteUser).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
    })

    it('Stripe以外の例外の場合、authユーザーを削除せずエラーメッセージを返す', async () => {
        mockLoginUser()
        mockAdminSupabase()
        mockDeleteAccountSupabase()
        mockCustomersDel.mockRejectedValue(new Error('network error'))

        const result = await deleteAccountAction()

        expect(result).toEqual(DELETE_ACCOUNT_ERROR)
        expect(mockAdminDeleteUser).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
    })

    it('authユーザーの削除でエラーが返った場合、サインアウトせずエラーメッセージを返す', async () => {
        mockLoginUser()
        mockAdminSupabase()
        const { signOut } = mockDeleteAccountSupabase()
        mockAdminDeleteUser.mockResolvedValue({
            error: { message: 'delete failed' },
        })

        const result = await deleteAccountAction()

        expect(result).toEqual(DELETE_ACCOUNT_ERROR)
        expect(signOut).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
    })
})
