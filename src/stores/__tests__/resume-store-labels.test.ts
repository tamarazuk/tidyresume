import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '../resume-store'
import { DEFAULT_LABEL_COLOR } from '@/lib/label-colors'

function clearLabels() {
  const state = useResumeStore.getState()
  for (const id of [...state.labelOrder]) {
    state.deleteLabel(id)
  }
}

describe('useResumeStore (labels)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    clearLabels()
  })

  it('initializes with empty labels', () => {
    const state = useResumeStore.getState()
    expect(state.labelsById).toEqual({})
    expect(state.labelOrder).toEqual([])
  })

  it('creates a label with default color', () => {
    const state = useResumeStore.getState()
    const labelId = state.createLabel('Frontend')

    const next = useResumeStore.getState()
    expect(next.labelOrder).toContain(labelId)
    expect(next.labelsById[labelId]).toEqual(
      expect.objectContaining({
        id: labelId,
        name: 'Frontend',
        color: DEFAULT_LABEL_COLOR,
      })
    )
  })

  it('creates a label with a custom color', () => {
    const state = useResumeStore.getState()
    const labelId = state.createLabel('Google', '#3b82f6')

    const next = useResumeStore.getState()
    expect(next.labelsById[labelId].color).toBe('#3b82f6')
  })

  it('updates a label name and color', () => {
    const state = useResumeStore.getState()
    const labelId = state.createLabel('Old Name', '#ef4444')
    state.updateLabel(labelId, { name: 'New Name', color: '#22c55e' })

    const label = useResumeStore.getState().labelsById[labelId]
    expect(label.name).toBe('New Name')
    expect(label.color).toBe('#22c55e')
  })

  it('updates only specified label fields', () => {
    const state = useResumeStore.getState()
    const labelId = state.createLabel('Keep Color', '#ef4444')
    state.updateLabel(labelId, { name: 'Renamed' })

    const label = useResumeStore.getState().labelsById[labelId]
    expect(label.name).toBe('Renamed')
    expect(label.color).toBe('#ef4444')
  })

  it('deletes a label', () => {
    const state = useResumeStore.getState()
    const labelId = state.createLabel('ToDelete')
    state.deleteLabel(labelId)

    const next = useResumeStore.getState()
    expect(next.labelsById[labelId]).toBeUndefined()
    expect(next.labelOrder).not.toContain(labelId)
  })

  it('preserves label order across multiple creations', () => {
    const state = useResumeStore.getState()
    const id1 = state.createLabel('First')
    const id2 = state.createLabel('Second')
    const id3 = state.createLabel('Third')

    expect(useResumeStore.getState().labelOrder).toEqual([id1, id2, id3])
  })
})

describe('useResumeStore (label assignment)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    clearLabels()
  })

  it('drafts initialize with empty labelIds', () => {
    const draft = useResumeStore.getState().getActiveDraft()
    expect(draft.labelIds).toEqual([])
  })

  it('adds a label to a draft', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const labelId = state.createLabel('Frontend')

    state.addLabelToDraft(draftId, labelId)

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).toContain(labelId)
  })

  it('does not duplicate label assignment', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const labelId = state.createLabel('Frontend')

    state.addLabelToDraft(draftId, labelId)
    state.addLabelToDraft(draftId, labelId)

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds.filter((id) => id === labelId)).toHaveLength(1)
  })

  it('removes a label from a draft', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const labelId = state.createLabel('Frontend')

    state.addLabelToDraft(draftId, labelId)
    state.removeLabelFromDraft(draftId, labelId)

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).not.toContain(labelId)
  })

  it('supports multiple labels on a single draft', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const id1 = state.createLabel('Frontend')
    const id2 = state.createLabel('Google')

    state.addLabelToDraft(draftId, id1)
    state.addLabelToDraft(draftId, id2)

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).toEqual([id1, id2])
  })

  it('supports the same label on multiple drafts', () => {
    const state = useResumeStore.getState()
    const draft1Id = state.getActiveDraft().draftId
    const draft2Id = state.createDraft()
    const labelId = state.createLabel('Shared')

    state.addLabelToDraft(draft1Id, labelId)
    state.addLabelToDraft(draft2Id, labelId)

    const next = useResumeStore.getState()
    expect(next.draftsById[draft1Id].labelIds).toContain(labelId)
    expect(next.draftsById[draft2Id].labelIds).toContain(labelId)
  })
})

describe('useResumeStore (label delete cascade)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    clearLabels()
  })

  it('removes deleted label from all drafts', () => {
    const state = useResumeStore.getState()
    const draft1Id = state.getActiveDraft().draftId
    const draft2Id = state.createDraft()
    const labelId = state.createLabel('ToRemove')

    state.addLabelToDraft(draft1Id, labelId)
    state.addLabelToDraft(draft2Id, labelId)
    state.deleteLabel(labelId)

    const next = useResumeStore.getState()
    expect(next.draftsById[draft1Id].labelIds).not.toContain(labelId)
    expect(next.draftsById[draft2Id].labelIds).not.toContain(labelId)
  })

  it('preserves other labels when one is deleted', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const keepId = state.createLabel('Keep')
    const deleteId = state.createLabel('Delete')

    state.addLabelToDraft(draftId, keepId)
    state.addLabelToDraft(draftId, deleteId)
    state.deleteLabel(deleteId)

    const draft = useResumeStore.getState().draftsById[draftId]
    expect(draft.labelIds).toEqual([keepId])
  })
})

describe('useResumeStore (label duplication)', () => {
  beforeEach(() => {
    useResumeStore.persist?.clearStorage?.()
    useResumeStore.getState().resetResume()
    clearLabels()
  })

  it('copies labels when duplicating a draft', () => {
    const state = useResumeStore.getState()
    const draftId = state.getActiveDraft().draftId
    const labelId = state.createLabel('Copied')

    state.addLabelToDraft(draftId, labelId)
    const dupId = state.duplicateDraft(draftId)!

    const next = useResumeStore.getState()
    expect(next.draftsById[dupId].labelIds).toEqual([labelId])
  })
})

describe('useResumeStore (label migration)', () => {
  it('migrates v8 state with drafts that lack labelIds', () => {
    // Simulate v8 persisted state without labels
    const v8State = {
      activeDraftId: 'draft-1',
      draftOrder: ['draft-1'],
      draftsById: {
        'draft-1': {
          draftId: 'draft-1',
          id: null,
          slug: null,
          editSecret: null,
          resumeTitle: 'Test',
          markdown: '',
          saveStatus: 'saved' as const,
          syncStatus: 'unsaved' as const,
          isPublished: false,
          imageWarning: null,
          contentWarning: null,
          resumeDisplay: { themeMode: 'auto' as const, theme: {} },
          createdAt: Date.now(),
          updatedAt: Date.now(),
          // No labelIds field — simulating pre-v9 data
        },
      },
      // No labelsById or labelOrder
    }

    // Access the persist config to call migrate directly
    const persistOptions = (
      useResumeStore as unknown as {
        persist: { getOptions: () => { migrate: (state: unknown) => unknown } }
      }
    ).persist.getOptions()
    const migrated = persistOptions.migrate(v8State) as {
      labelsById: Record<string, unknown>
      labelOrder: string[]
      draftsById: Record<string, { labelIds: string[] }>
    }

    expect(migrated.labelsById).toEqual({})
    expect(migrated.labelOrder).toEqual([])
    expect(migrated.draftsById['draft-1'].labelIds).toEqual([])
  })

  it('migrates v1 flat state without labels', () => {
    const v1State = {
      resumeTitle: 'Legacy Resume',
      markdown: '# Hello',
      saveStatus: 'saved' as const,
      isPublished: false,
      // No draftsById, no labels
    }

    const persistOptions = (
      useResumeStore as unknown as {
        persist: { getOptions: () => { migrate: (state: unknown) => unknown } }
      }
    ).persist.getOptions()
    const migrated = persistOptions.migrate(v1State) as {
      labelsById: Record<string, unknown>
      labelOrder: string[]
      draftsById: Record<string, { labelIds: string[] }>
      draftOrder: string[]
    }

    expect(migrated.labelsById).toEqual({})
    expect(migrated.labelOrder).toEqual([])

    const draftId = migrated.draftOrder[0]
    expect(migrated.draftsById[draftId].labelIds).toEqual([])
  })

  it('preserves existing labels during migration', () => {
    const existingLabel = {
      id: 'label-1',
      name: 'Google',
      color: '#3b82f6',
      createdAt: 1000,
      updatedAt: 1000,
    }

    const v8WithLabels = {
      activeDraftId: 'draft-1',
      draftOrder: ['draft-1'],
      draftsById: {
        'draft-1': {
          draftId: 'draft-1',
          id: null,
          slug: null,
          editSecret: null,
          resumeTitle: 'Test',
          markdown: '',
          saveStatus: 'saved' as const,
          syncStatus: 'unsaved' as const,
          isPublished: false,
          imageWarning: null,
          contentWarning: null,
          resumeDisplay: { themeMode: 'auto' as const, theme: {} },
          labelIds: ['label-1'],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      },
      labelsById: { 'label-1': existingLabel },
      labelOrder: ['label-1'],
    }

    const persistOptions = (
      useResumeStore as unknown as {
        persist: { getOptions: () => { migrate: (state: unknown) => unknown } }
      }
    ).persist.getOptions()
    const migrated = persistOptions.migrate(v8WithLabels) as {
      labelsById: Record<string, typeof existingLabel>
      labelOrder: string[]
      draftsById: Record<string, { labelIds: string[] }>
    }

    expect(migrated.labelsById['label-1']).toEqual(existingLabel)
    expect(migrated.labelOrder).toEqual(['label-1'])
    expect(migrated.draftsById['draft-1'].labelIds).toEqual(['label-1'])
  })
})
