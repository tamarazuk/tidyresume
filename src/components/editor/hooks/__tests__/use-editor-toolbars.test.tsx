import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useEditorToolbars } from '../use-editor-toolbars'

const setImageWarning = vi.fn()
const setEditorViewState = vi.fn()

vi.mock('@/stores/resume-store', () => ({
  useResumeStore: (selector: (state: { setImageWarning: typeof setImageWarning }) => unknown) =>
    selector({ setImageWarning }),
}))

vi.mock('@/stores/editor-view-store', () => ({
  useEditorViewStore: (
    selector: (state: {
      editorViewState: {
        preview: boolean
        previewOnly: boolean
        htmlPreview: boolean
      }
      setEditorViewState: typeof setEditorViewState
    }) => unknown
  ) =>
    selector({
      editorViewState: {
        preview: false,
        previewOnly: false,
        htmlPreview: false,
      },
      setEditorViewState,
    }),
}))

type MockImageSize = { width: number; height: number }

let nextFileReaderResult = 'data:image/jpeg;base64,abc'
let nextImageSize: MockImageSize = { width: 700, height: 700 }

const toDataURLMock = vi.fn()

const originalFileReader = global.FileReader
const originalImage = global.Image
const originalCreateElement = document.createElement.bind(document)

class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: null | (() => void) = null
  onerror: null | (() => void) = null
  error: Error | null = null

  readAsDataURL() {
    this.result = nextFileReaderResult
    this.onload?.()
  }
}

class MockImage {
  naturalWidth: number
  naturalHeight: number
  onload: null | (() => void) = null
  onerror: null | (() => void) = null
  #src = ''

  constructor() {
    this.naturalWidth = nextImageSize.width
    this.naturalHeight = nextImageSize.height
  }

  set src(value: string) {
    this.#src = value
    this.onload?.()
  }

  get src() {
    return this.#src
  }
}

async function flushMicrotasks() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useEditorToolbars image handling', () => {
  beforeEach(() => {
    setImageWarning.mockClear()
    setEditorViewState.mockClear()
    toDataURLMock.mockReset()
    nextFileReaderResult = 'data:image/jpeg;base64,abc'
    nextImageSize = { width: 700, height: 700 }

    global.FileReader = MockFileReader as typeof FileReader
    global.Image = MockImage as typeof Image

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: vi.fn() }),
          toDataURL: toDataURLMock,
        } as unknown as HTMLCanvasElement
      }
      return originalCreateElement(tagName)
    })
  })

  afterEach(() => {
    global.FileReader = originalFileReader
    global.Image = originalImage
    vi.restoreAllMocks()
  })

  it('clamps oversized images to the max width before inserting', async () => {
    const insert = vi.fn()
    const editorRef = {
      current: {
        insert,
        on: vi.fn(),
        off: vi.fn(),
      },
    }

    nextImageSize = { width: 1400, height: 2100 }
    toDataURLMock.mockReturnValue('data:image/jpeg;base64,' + 'a'.repeat(1000))

    const { result } = renderHook(() => useEditorToolbars({ editorRef }))

    const file = new File(['content'], 'portrait.jpg', { type: 'image/jpeg' })

    await act(async () => {
      result.current.uploadInputProps.onChange?.({
        target: { files: [file], value: 'file' },
      } as React.ChangeEvent<HTMLInputElement>)
      await flushMicrotasks()
    })

    expect(insert).toHaveBeenCalledTimes(1)
    const insertPayload = insert.mock.calls[0]?.[0]()
    expect(insertPayload.targetValue).toContain('=700x')
    expect(setImageWarning).toHaveBeenCalledWith(null)
  })

  it('sets a warning when a resized image exceeds the storage limit', async () => {
    const insert = vi.fn()
    const editorRef = {
      current: {
        insert,
        on: vi.fn(),
        off: vi.fn(),
      },
    }

    nextImageSize = { width: 1400, height: 2100 }
    toDataURLMock.mockReturnValue('data:image/png;base64,' + 'a'.repeat(1_500_001))

    const { result } = renderHook(() => useEditorToolbars({ editorRef }))

    const file = new File(['content'], 'oversized.png', { type: 'image/png' })

    await act(async () => {
      result.current.uploadInputProps.onChange?.({
        target: { files: [file], value: 'file' },
      } as React.ChangeEvent<HTMLInputElement>)
      await flushMicrotasks()
    })

    expect(insert).not.toHaveBeenCalled()
    expect(setImageWarning).toHaveBeenCalledWith('Image too large to store')
  })
})
