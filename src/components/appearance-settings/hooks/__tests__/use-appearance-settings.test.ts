import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppearanceSettings } from '../use-appearance-settings'
import { useResumeStore } from '@/stores/resume-store'

describe('useAppearanceSettings', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.setState({
      resumeDisplay: {
        theme: {},
        id: '123',
        title: 'Test Resume',
        content: '',
        slug: 'test-resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
  })

  it('provides page margins state and actions', () => {
    const { result } = renderHook(() => useAppearanceSettings())

    // Check defaults
    expect(result.current.margins).toEqual({
      top: 15,
      right: 15,
      bottom: 15,
      left: 15,
    })

    // Check setMargins action
    act(() => {
      result.current.actions.setMargins({
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      })
    })

    expect(result.current.margins).toEqual({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    })
  })

  it('syncs margins when vertical lock is active', () => {
    const { result } = renderHook(() => useAppearanceSettings())

    // Toggle vertical lock
    act(() => {
      result.current.actions.toggleVerticalLock()
    })

    expect(result.current.verticalLock).toBe(true)

    // Set top margin
    act(() => {
      result.current.actions.setMargins({ top: 30 })
    })

    // Expect bottom to match top
    expect(result.current.margins.bottom).toBe(30)
    expect(result.current.margins.top).toBe(30)
  })

  it('syncs margins when horizontal lock is active', () => {
    const { result } = renderHook(() => useAppearanceSettings())

    // Toggle horizontal lock
    act(() => {
      result.current.actions.toggleHorizontalLock()
    })

    expect(result.current.horizontalLock).toBe(true)

    // Set left margin
    act(() => {
      result.current.actions.setMargins({ left: 30 })
    })

    // Expect right to match left
    expect(result.current.margins.right).toBe(30)
    expect(result.current.margins.left).toBe(30)
  })
})
