// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditComponent } from '@/components/app/loginUser-pages/script/edit'
import type { getEditScript, scriptData } from '@/types/script'

vi.mock('@/lib/actions/script/editScript', () => ({
    editScript: vi.fn(),
    editScriptName: vi.fn(),
}))

// useEditScriptForm は lib/validation/hooks.ts の一部で、
// そのファイルは signUp.ts(Stripeクライアントを初期化する
// checkout.ts を間接的にimportしている)を読み込むため、
// 実際には使わなくてもここでモックしておく必要がある
vi.mock('@/lib/actions/auth/signUp', () => ({}))

const mockScriptData: scriptData = {
    id: 1,
    user_id: 'user-1',
    title: 'テスト台本',
    content: {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'こんにちは' }],
            },
        ],
    },
    plain_content: 'こんにちは',
    inserted_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
}

describe('EditComponent', () => {
    it('scriptの取得に失敗している場合、エラーメッセージが表示される', () => {
        const errorScript: getEditScript = {
            success: false,
            error: '台本が見つかりませんでした。',
        }

        render(<EditComponent script={errorScript} />)

        expect(
            screen.getByText('台本が見つかりませんでした。')
        ).toBeInTheDocument()
    })

    it('正常なscriptデータならクラッシュせずに描画される', () => {
        const successScript: getEditScript = {
            success: true,
            data: mockScriptData,
        }

        render(<EditComponent script={successScript} />)

        expect(screen.getByDisplayValue('テスト台本')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    })
})
