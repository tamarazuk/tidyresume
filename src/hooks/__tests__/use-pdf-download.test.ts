import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePdfDownload, sanitizeFilename } from '../use-pdf-download'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { toast } from 'sonner'

describe('usePdfDownload', () => {
  let mockFetch: ReturnType<typeof vi.fn>
  let originalCreateObjectURL: typeof URL.createObjectURL
  let originalRevokeObjectURL: typeof URL.revokeObjectURL

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Save originals and mock URL methods
    originalCreateObjectURL = URL.createObjectURL
    originalRevokeObjectURL = URL.revokeObjectURL
    URL.createObjectURL = vi.fn(() => 'blob:http://localhost/test-blob')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    // Restore URL methods
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
    vi.restoreAllMocks()
  })

  it('should initialize with isDownloading as false', () => {
    const { result } = renderHook(() => usePdfDownload())

    expect(result.current.isDownloading).toBe(false)
    expect(typeof result.current.downloadPdf).toBe('function')
  })

  it('should set isDownloading to true while downloading', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob(['test'])),
              }),
            100
          )
        )
    )

    const { result } = renderHook(() => usePdfDownload())

    act(() => {
      result.current.downloadPdf('test-id')
    })

    expect(result.current.isDownloading).toBe(true)

    await waitFor(() => {
      expect(result.current.isDownloading).toBe(false)
    })
  })

  it('should fetch PDF from correct endpoint', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf content'])),
    })

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('my-resume-id')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/resumes/my-resume-id/pdf')
  })

  it('should create blob URL and trigger download', async () => {
    vi.useFakeTimers()
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    })

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id', 'My Resume')
    })

    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob)

    // URL.revokeObjectURL is called after a 100ms delay to ensure browser
    // finishes reading the blob
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(
      'blob:http://localhost/test-blob'
    )
    vi.useRealTimers()
  })

  it('should show success toast on successful download', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['pdf content'])),
    })

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(toast.success).toHaveBeenCalledWith('PDF downloaded')
  })

  it('should handle fetch error and show error toast', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Server error'),
    })

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(toast.error).toHaveBeenCalledWith('Server error')
    expect(result.current.isDownloading).toBe(false)
  })

  it('should handle network error and show generic error toast', async () => {
    mockFetch.mockRejectedValue(new Error('Network failed'))

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(toast.error).toHaveBeenCalledWith('Network failed')
    expect(result.current.isDownloading).toBe(false)
  })

  it('should show default error message for non-Error exceptions', async () => {
    mockFetch.mockRejectedValue('Unknown error')

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to download PDF')
  })

  it('should reset isDownloading to false after error', async () => {
    mockFetch.mockRejectedValue(new Error('Failed'))

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(result.current.isDownloading).toBe(false)
  })

  it('should handle empty error response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve(''),
    })

    const { result } = renderHook(() => usePdfDownload())

    await act(async () => {
      await result.current.downloadPdf('test-id')
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to generate PDF')
  })
})

describe('sanitizeFilename', () => {
  it('should return default filename for undefined input', () => {
    expect(sanitizeFilename(undefined)).toBe('resume.pdf')
  })

  it('should return default filename for empty string', () => {
    expect(sanitizeFilename('')).toBe('resume.pdf')
  })

  it('should return default filename for whitespace-only string', () => {
    expect(sanitizeFilename('   ')).toBe('resume.pdf')
  })

  it('should append .pdf if missing', () => {
    expect(sanitizeFilename('My Resume')).toBe('My Resume.pdf')
  })

  it('should not double-append .pdf if already present', () => {
    expect(sanitizeFilename('My Resume.pdf')).toBe('My Resume.pdf')
  })

  it('should handle .PDF extension (case insensitive)', () => {
    expect(sanitizeFilename('My Resume.PDF')).toBe('My Resume.PDF')
  })

  it('should remove forward slashes', () => {
    expect(sanitizeFilename('path/to/file')).toBe('pathtofile.pdf')
  })

  it('should remove backslashes', () => {
    expect(sanitizeFilename('path\\to\\file')).toBe('pathtofile.pdf')
  })

  it('should remove question marks', () => {
    expect(sanitizeFilename('file?name')).toBe('filename.pdf')
  })

  it('should remove percent signs', () => {
    expect(sanitizeFilename('file%20name')).toBe('file20name.pdf')
  })

  it('should remove asterisks', () => {
    expect(sanitizeFilename('file*name')).toBe('filename.pdf')
  })

  it('should remove colons', () => {
    expect(sanitizeFilename('file:name')).toBe('filename.pdf')
  })

  it('should remove pipes', () => {
    expect(sanitizeFilename('file|name')).toBe('filename.pdf')
  })

  it('should remove double quotes', () => {
    expect(sanitizeFilename('file"name')).toBe('filename.pdf')
  })

  it('should remove angle brackets', () => {
    expect(sanitizeFilename('file<name>')).toBe('filename.pdf')
  })

  it('should trim whitespace', () => {
    expect(sanitizeFilename('  My Resume  ')).toBe('My Resume.pdf')
  })

  it('should handle multiple invalid characters', () => {
    expect(sanitizeFilename('John\'s Resume <2024> | Draft')).toBe(
      "John's Resume 2024  Draft.pdf"
    )
  })

  it('should return default if only invalid characters remain', () => {
    expect(sanitizeFilename('/<>:"|?*\\')).toBe('resume.pdf')
  })

  it('should preserve valid special characters like apostrophes', () => {
    expect(sanitizeFilename("John's Resume")).toBe("John's Resume.pdf")
  })

  it('should preserve hyphens and underscores', () => {
    expect(sanitizeFilename('my-resume_2024')).toBe('my-resume_2024.pdf')
  })

  it('should preserve spaces', () => {
    expect(sanitizeFilename('My Resume 2024')).toBe('My Resume 2024.pdf')
  })
})
