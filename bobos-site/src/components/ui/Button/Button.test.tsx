import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button, buttonVariants } from '@/components/ui/Button'

describe('Button', () => {
  it('is a type="button" by default and fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Add</Button>)
    const button = screen.getByRole('button', { name: 'Add' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies variant classes from tokens only', () => {
    render(<Button variant="secondary">Menu</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-primary', 'text-primary')
  })

  it('exposes variants for links', () => {
    expect(buttonVariants({ variant: 'primary' })).toContain('bg-primary')
  })
})
