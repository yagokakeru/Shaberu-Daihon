// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { signInAction } from '@/lib/actions/auth/signIn'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { LoginForm } from '@/components/app/auth-pages/sign-in'

vi.mock('@/lib/actions/auth/signIn', () => ({
    signInAction: vi.fn(),
}))
// lib/validation/hooks.ts が signUp.ts(Stripeクライアントを初期化する
// checkout.ts を間接的にimportしている)を読み込むため、ここでモックしておく
vi.mock('@/lib/actions/auth/signUp', () => ({}))

describe('LoginForm', () => {
    it('不正なメールアドレスで送信するとエラーメッセージが表示され、signInActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<LoginForm initialMessage={null} />)
        await user.type(screen.getByLabelText('メールアドレス'), 'invalid')
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))
        expect(
            await screen.findByText('正しいメールアドレスを入力してください')
        ).toBeInTheDocument()
        expect(signInAction).not.toHaveBeenCalled()
    })

    it('不正なパスワードで送信するとエラーメッセージが表示され、signInActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<LoginForm initialMessage={null} />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'short')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))
        expect(
            await screen.findByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument()
        expect(signInAction).not.toHaveBeenCalled()
    })

    it('正しいメールアドレスとパスワードを入力して送信するとsignInActionが正しい引数で呼ばれる', async () => {
        vi.mocked(signInAction).mockImplementation(() => new Promise(() => {})) // 本物のredirectと同様、解決しないPromiseにしておく

        const user = userEvent.setup()
        render(<LoginForm initialMessage={null} />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))

        expect(signInAction).toHaveBeenCalledWith({
            email: 'valid@example.com',
            password: 'Password1',
        })
    })

    it('正しいメールアドレスとパスワードを入力して送信するとsignInActionアクションが呼ばれて、supabaceからエラーが返ってきてエラーメッセージを表示する', async () => {
        vi.mocked(signInAction).mockResolvedValue({
            messageType: 'error',
            message:
                'ログインできませんでした。メールアドレスとパスワードを確認してください。',
        })

        const user = userEvent.setup()
        render(<LoginForm initialMessage={null} />)
        const emailInput = screen.getByLabelText('メールアドレス')
        const passwordInput = screen.getByLabelText('パスワード')
        await user.type(emailInput, 'test@example.com')
        await user.type(passwordInput, 'Password1')
        await user.click(screen.getByRole('button', { name: 'ログイン' }))
        expect(signInAction).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password1',
        })
        expect(
            await screen.findByText(
                'ログインできませんでした。メールアドレスとパスワードを確認してください。'
            )
        ).toBeInTheDocument()
    })
})
