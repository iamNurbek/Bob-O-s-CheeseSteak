import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input, TextArea } from '@/components/ui/Input'

describe('Input', () => {
  it('is labelled and links hint text', () => {
    render(<Input label="Email" hint="We reply within a day" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAccessibleDescription('We reply within a day')
    expect(input).not.toBeInvalid()
  })

  it('marks itself invalid and announces the error', () => {
    render(<Input label="Email" error="Enter a valid email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Enter a valid email')
  })
})

describe('TextArea', () => {
  it('is labelled', () => {
    render(<TextArea label="Message" />)
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
  })
})
