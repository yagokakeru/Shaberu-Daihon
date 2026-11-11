import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/submit-button'
import ConfirmDialog from '@/components/ui/comfirm/dialog'
import { deleteAccountAction } from '@/lib/actions/auth/deleteAccount'
import { signOutAction } from '@/lib/actions/auth/signOut'
import type { Message } from '@/types/message'

export const MypageAccount = ({
    setToastMessage,
}: {
    setToastMessage: (message: Message) => void
}) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        const message = await deleteAccountAction()
        setToastMessage(message)
        setIsDeleting(false)
    }

    return (
        <div>
            <h2 className="text-heading-h2-pc max-md:text-heading-h2-sp">
                アカウント操作
            </h2>

            <form className="mt-40-pc max-md:mt-40-sp">
                <SubmitButton
                    pendingText="ログアウト中..."
                    formAction={async () => {
                        const message = await signOutAction()
                        setToastMessage(message)
                    }}
                >
                    ログアウト
                </SubmitButton>
            </form>
            <Button
                type="button"
                variant={'secondary'}
                className="mt-16-pc max-md:mt-16-sp"
                aria-disabled={isDeleting}
                onClick={() => setConfirmDialogOpen(true)}
            >
                {isDeleting ? 'アカウント削除中...' : 'アカウント削除'}
            </Button>
            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleDeleteAccount}
                title="アカウントを削除しますか？"
                description="この操作は元に戻せません"
            />
        </div>
    )
}
