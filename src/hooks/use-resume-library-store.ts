'use client'

import { useShallow } from 'zustand/react/shallow'
import { useResumeStore } from '@/stores/resume-store'

/**
 * Combined store selector for the Resume Library page.
 * Uses shallow comparison to prevent unnecessary re-renders when
 * selecting multiple values from the store.
 */
export function useResumeLibraryStore() {
  return useResumeStore(
    useShallow((state) => ({
      // Data
      draftOrder: state.draftOrder,
      draftsById: state.draftsById,
      labelsById: state.labelsById,
      labelOrder: state.labelOrder,
      // Actions
      createDraft: state.createDraft,
      setActiveDraft: state.setActiveDraft,
      deleteDraft: state.deleteDraft,
      duplicateDraft: state.duplicateDraft,
    }))
  )
}
