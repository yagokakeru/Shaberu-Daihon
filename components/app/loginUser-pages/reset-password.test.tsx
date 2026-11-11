// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { resetPasswordAction } from '@/lib/actions/auth/resetPassword'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import ResetPasswordForm from '@/components/app/loginUser-pages/reset-password'

vi.mock('@/lib/actions/auth/resetPassword', () => ({
    resetPasswordAction: vi.fn(),
}))
// lib/validation/hooks.ts が signUp.ts(Stripeクライアントを初期化する
// checkout.ts を間接的にimportしている)を読み込むため、ここでモックしておく
vi.mock('@/lib/actions/auth/signUp', () => ({}))

describe('ResetPasswordForm', () => {
    it('不正なパスワードで送信するとエラーメッセージが表示され、resetPasswordActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.type(screen.getByLabelText('パスワード'), 'short')
        await user.type(
            screen.getByLabelText('パスワードを確認してください'),
            'short'
        )
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(
            await screen.findByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument()
        expect(resetPasswordAction).not.toHaveBeenCalled()
    })

    it('確認用パスワードが一致しない状態で送信するとエラーメッセージが表示され、resetPasswordActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.type(screen.getByLabelText('パスワード'), 'validPassword1')
        await user.type(
            screen.getByLabelText('パスワードを確認してください'),
            'validPassword2'
        )
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(
            await screen.findByText('パスワードが一致しません')
        ).toBeInTheDocument()
        expect(resetPasswordAction).not.toHaveBeenCalled()
    })

    it('入力が正常の場合はresetPasswordActionが呼ばれて,成功メッセージが表示される', async () => {
        vi.mocked(resetPasswordAction).mockResolvedValue({
            messageType: 'success',
            message: 'パスワードの更新に成功しました。',
        })

        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.type(screen.getByLabelText('パスワード'), 'validPassword1')
        await user.type(
            screen.getByLabelText('パスワードを確認してください'),
            'validPassword1'
        )
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(resetPasswordAction).toHaveBeenCalledWith({
            newPassword: 'validPassword1',
            newPasswordConfirm: 'validPassword1',
        })
        expect(
            await screen.findByText('パスワードの更新に成功しました。')
        ).toBeInTheDocument()
    })

    it('正常に入力して送信するとresetPasswordActionアクションが呼ばれて、supabaseからエラーが返ってきてエラーメッセージを表示する', async () => {
        vi.mocked(resetPasswordAction).mockResolvedValue({
            messageType: 'error',
            message: 'パスワードの更新に失敗しました。',
        })

        const user = userEvent.setup()
        render(<ResetPasswordForm />)
        await user.type(screen.getByLabelText('パスワード'), 'validPassword1')
        await user.type(
            screen.getByLabelText('パスワードを確認してください'),
            'validPassword1'
        )
        await user.click(screen.getByRole('button', { name: '続ける' }))
        expect(resetPasswordAction).toHaveBeenCalledWith({
            newPassword: 'validPassword1',
            newPasswordConfirm: 'validPassword1',
        })
        expect(
            await screen.findByText('パスワードの更新に失敗しました。')
        ).toBeInTheDocument()
    })
})
