import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Toast } from '@/components/ui/Toast'

describe('Toast', () => {
  it('shows the message and can be dismissed', async () => {
    const onDismiss = vi.fn()
    render(<Toast message="Added The Bob-O" onDismiss={onDismiss} />)
    expect(screen.getByText('Added The Bob-O')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
