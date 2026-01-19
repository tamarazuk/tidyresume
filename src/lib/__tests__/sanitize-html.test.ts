import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../sanitize-html'

describe('sanitizeHtml', () => {
  it('allows data-line attributes', () => {
    const input = '<h1 data-line="10">Header</h1>'
    const output = sanitizeHtml(input)
    expect(output).toBe('<h1 data-line="10">Header</h1>')
  })

  it('still sanitizes dangerous scripts', () => {
    const input = '<script>alert("xss")</script><h1 data-line="1">Header</h1>'
    const output = sanitizeHtml(input)
    expect(output).toBe('<h1 data-line="1">Header</h1>')
  })
})
