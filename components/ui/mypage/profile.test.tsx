// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createStore, Provider } from 'jotai'
import { updateProfile } from '@/lib/actions/auth/updateProfile'
import { uploadImage } from '@/lib/actions/auth/uploadImage'
import { deleteImage } from '@/lib/actions/auth/deleteImage'
import { createAvatarUrl } from '@/lib/actions/auth/createAvatarUrl'
import { userProfileAtom } from '@/lib/atoms/authUser'
import { MypageProfile } from '@/components/ui/mypage/profile'
import type { userProfile } from '@/types/userProfile'

vi.mock('@/lib/actions/auth/updateProfile', () => ({
    updateProfile: vi.fn(),
}))
vi.mock('@/lib/actions/auth/uploadImage', () => ({
    uploadImage: vi.fn(),
}))
vi.mock('@/lib/actions/auth/deleteImage', () => ({
    deleteImage: vi.fn(),
}))
vi.mock('@/lib/actions/auth/createAvatarUrl', () => ({
    createAvatarUrl: vi.fn(),
}))

// useProfileFrom は lib/validation/hooks.ts の一部で、
// そのファイルは signUp.ts(Stripeクライアントを初期化する
// checkout.ts を間接的にimportしている)を読み込むため、
// 実際には使わなくてもここでモックしておく必要がある
vi.mock('@/lib/actions/auth/signUp', () => ({}))

const mockUserProfile: userProfile = {
    user_id: 'user-1',
    email: 'user@example.com',
    created_at: '2024-01-01T00:00:00.000Z',
    profile_id: 1,
    stripe_uuid: 'cus_123',
    name: '山田太郎',
    avatar_url: '',
}

const renderMypageProfile = (profileOverride: Partial<userProfile> = {}) => {
    const setToastMessage = vi.fn()
    const store = createStore()
    store.set(userProfileAtom, { ...mockUserProfile, ...profileOverride })

    render(
        <Provider store={store}>
            <MypageProfile setToastMessage={setToastMessage} />
        </Provider>
    )

    return { setToastMessage }
}

describe('MypageProfile', () => {
    it('256文字を超える名前で送信するとエラーメッセージが表示され、updateProfileは呼ばれない', async () => {
        const user = userEvent.setup()
        renderMypageProfile()

        const nameInput = screen.getByLabelText('名前')
        await user.clear(nameInput)
        await user.type(nameInput, 'あ'.repeat(256))
        await user.click(screen.getByRole('button', { name: '保存' }))

        expect(
            await screen.findByText('名前は255文字以内で入力してください')
        ).toBeInTheDocument()
        expect(updateProfile).not.toHaveBeenCalled()
    })

    it('正しい名前で送信するとupdateProfileが正しい引数で呼ばれ、setToastMessageに成功メッセージが渡される', async () => {
        vi.mocked(updateProfile).mockResolvedValue({
            messageType: 'success',
            message: 'プロフィールを更新しました。',
        })

        const user = userEvent.setup()
        const { setToastMessage } = renderMypageProfile()

        const nameInput = screen.getByLabelText('名前')
        await user.clear(nameInput)
        await user.type(nameInput, '鈴木一郎')
        await user.click(screen.getByRole('button', { name: '保存' }))

        expect(updateProfile).toHaveBeenCalledWith(
            expect.objectContaining({ name: '鈴木一郎' }),
            'user-1'
        )
        await waitFor(() => {
            expect(setToastMessage).toHaveBeenCalledWith({
                messageType: 'success',
                message: 'プロフィールを更新しました。',
            })
        })
    })

    it('updateProfileが失敗を返した場合、setToastMessageに失敗メッセージが渡される', async () => {
        vi.mocked(updateProfile).mockResolvedValue({
            messageType: 'error',
            message: 'プロフィールを更新できませんでした。',
        })

        const user = userEvent.setup()
        const { setToastMessage } = renderMypageProfile()

        const nameInput = screen.getByLabelText('名前')
        await user.clear(nameInput)
        await user.type(nameInput, '鈴木一郎')
        await user.click(screen.getByRole('button', { name: '保存' }))

        await waitFor(() => {
            expect(setToastMessage).toHaveBeenCalledWith({
                messageType: 'error',
                message: 'プロフィールを更新できませんでした。',
            })
        })
    })

    it('画像を選択するとuploadImageが呼ばれ、setToastMessageに成功メッセージが渡される', async () => {
        vi.mocked(uploadImage).mockResolvedValue({
            messageType: 'success',
            message: 'アバター画像を更新しました。',
            avatarUrl: 'user-1/avatar.png',
        })

        const user = userEvent.setup()
        const { setToastMessage } = renderMypageProfile()

        const file = new File(['dummy'], 'avatar.png', { type: 'image/png' })
        const fileInput = screen.getByLabelText('プロフィール画像を変更')
        await user.upload(fileInput, file)

        expect(uploadImage).toHaveBeenCalledWith(file, 'user-1')
        await waitFor(() => {
            expect(setToastMessage).toHaveBeenCalledWith({
                messageType: 'success',
                message: 'アバター画像を更新しました。',
                avatarUrl: 'user-1/avatar.png',
            })
        })
    })

    it('アバター画像がある状態で削除ボタンを押すとdeleteImageが呼ばれ、setToastMessageに成功メッセージが渡される', async () => {
        vi.mocked(createAvatarUrl).mockResolvedValue(
            'https://example.com/signed-url.png'
        )
        vi.mocked(deleteImage).mockResolvedValue({
            messageType: 'success',
            message: '画像を削除しました。',
        })

        const user = userEvent.setup()
        const { setToastMessage } = renderMypageProfile({
            avatar_url: 'user-1/avatar.png',
        })

        await user.click(
            screen.getByRole('button', { name: 'アバター画像を削除' })
        )

        expect(deleteImage).toHaveBeenCalledWith('user-1')
        await waitFor(() => {
            expect(setToastMessage).toHaveBeenCalledWith({
                messageType: 'success',
                message: '画像を削除しました。',
            })
        })
    })
})
