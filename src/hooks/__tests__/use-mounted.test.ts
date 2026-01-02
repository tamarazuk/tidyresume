import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMounted } from '@/hooks/use-mounted'

describe('useMounted', () => {
  it('returns false before mount and true after mount', async () => {
    const { result } = renderHook(() => useMounted())

    expect(result.current).toBe(false)

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })
})
