import { describe, it, expect } from 'vitest'
import { TOOLBAR_LAYOUT } from '../toolbar-items'

describe('TOOLBAR_LAYOUT', () => {
  it('places the separator between full width and view modes', () => {
    const fullWidthIndex = TOOLBAR_LAYOUT.findIndex(
      (item) => item.type === 'custom' && item.id === 'fullWidth'
    )
    const separatorIndex = TOOLBAR_LAYOUT.findIndex(
      (item, index) => item.type === 'separator' && index > fullWidthIndex
    )
    const viewEditorIndex = TOOLBAR_LAYOUT.findIndex(
      (item) => item.type === 'custom' && item.id === 'viewEditor'
    )

    expect(fullWidthIndex).toBeGreaterThan(-1)
    expect(viewEditorIndex).toBeGreaterThan(fullWidthIndex)
    expect(separatorIndex).toBeGreaterThan(fullWidthIndex)
    expect(separatorIndex).toBeLessThan(viewEditorIndex)
  })

  it('removes edit link and print from the toolbar layout', () => {
    const hasEditLink = TOOLBAR_LAYOUT.some(
      (item) => item.type === 'custom' && item.id === 'editLink'
    )
    const hasPrint = TOOLBAR_LAYOUT.some(
      (item) => item.type === 'custom' && item.id === 'print'
    )

    expect(hasEditLink).toBe(false)
    expect(hasPrint).toBe(false)
  })
})
