import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { MarginInput } from '../margin-input'

describe('MarginInput', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with label and value', () => {
    render(
      <MarginInput
        label="Top"
        value={15}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Top')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15')).toBeInTheDocument()
    expect(screen.getByText('mm')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    render(
      <MarginInput
        label="Top"
        value={15}
        onChange={onChange}
      />
    )

    const input = screen.getByLabelText('Top')
    fireEvent.change(input, { target: { value: '20' } })
    
    expect(onChange).toHaveBeenCalledWith(20)
  })

  it('respects min and max values', () => {
    const onChange = vi.fn()
    render(
      <MarginInput
        label="Top"
        value={15}
        onChange={onChange}
        min={0}
        max={50}
      />
    )

    const input = screen.getByLabelText('Top')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '50')
  })
})
