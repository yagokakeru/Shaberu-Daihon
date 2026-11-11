// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { signUpAction } from '@/lib/actions/auth/signUp'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUpForm } from '@/components/app/auth-pages/sign-up'

vi.mock('@/lib/actions/auth/signUp', () => ({
    signUpAction: vi.fn(),
}))

describe('SignUpForm', () => {
    it('不正なメールアドレスで送信するとエラーメッセージが表示され、signUpActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(screen.getByLabelText('メールアドレス'), 'invalid')
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('checkbox'))
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(
            await screen.findByText('正しいメールアドレスを入力してください')
        ).toBeInTheDocument()
        expect(signUpAction).not.toHaveBeenCalled()
    })

    it('不正なパスワードで送信するとエラーメッセージが表示され、signUpActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'short')
        await user.click(screen.getByRole('checkbox'))
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(
            await screen.findByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument()
        expect(signUpAction).not.toHaveBeenCalled()
    })

    it('利用規約・プライバシーポリシーに同意せずに送信するとエラーメッセージが表示され、signUpActionは呼ばれない', async () => {
        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(await screen.findByText('同意が必要です')).toBeInTheDocument()
        expect(signUpAction).not.toHaveBeenCalled()
    })

    it('正しいメールアドレスとパスワードを入力し、同意して送信するとsignUpActionが正しい引数で呼ばれる', async () => {
        vi.mocked(signUpAction).mockImplementation(() => new Promise(() => {})) // 本物のredirectと同様、解決しないPromiseにしておく

        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'valid@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('checkbox'))
        await user.click(screen.getByRole('button', { name: '新規登録' }))

        expect(signUpAction).toHaveBeenCalledWith({
            email: 'valid@example.com',
            password: 'Password1',
            priceid: '',
            consent: true,
        })
    })

    it('正しい入力で送信してsupabaseからエラーが返ってきた場合、エラーメッセージを表示する', async () => {
        vi.mocked(signUpAction).mockResolvedValue({
            messageType: 'error',
            message:
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。',
        })

        const user = userEvent.setup()
        render(<SignUpForm />)
        await user.type(
            screen.getByLabelText('メールアドレス'),
            'test@example.com'
        )
        await user.type(screen.getByLabelText('パスワード'), 'Password1')
        await user.click(screen.getByRole('checkbox'))
        await user.click(screen.getByRole('button', { name: '新規登録' }))
        expect(signUpAction).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password1',
            priceid: '',
            consent: true,
        })
        expect(
            await screen.findByText(
                'ユーザーの作成に失敗しました。しばらくしてからもう一度お試しください。'
            )
        ).toBeInTheDocument()
    })
})
