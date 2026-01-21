import { describe, it, expect } from 'vitest'
import { DEFAULT_RESUME_THEME } from '@/lib/resume-theme'

describe('Resume Theme Margins', () => {
  it('should have default page margins', () => {
    // This test expects the 'page' property to exist on the theme,
    // which effectively tests both the type definition and the default value.
    expect(DEFAULT_RESUME_THEME.page?.margins).toEqual({
      top: 15,
      right: 15,
      bottom: 15,
      left: 15,
    })
  })
})
