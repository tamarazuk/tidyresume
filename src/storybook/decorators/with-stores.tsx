import { useEffect, useRef, type ReactNode } from 'react'
import type { Decorator } from '@storybook/react'
import {
  DEFAULT_RESUME_MARGINS,
  DEFAULT_RESUME_THEME,
} from '@/lib/resume-theme'
import { DEFAULT_RESUME_TITLE } from '@/lib/constants'
import { DEFAULT_RESUME } from '@/components/editor/constants'
import { useResumeStore } from '@/stores/resume-store'
import { useEditorViewStore } from '@/stores/editor-view-store'
import { usePublicViewStore } from '@/stores/public-view-store'
import type {
  StorybookEditorViewSeed,
  StorybookParameters,
  StorybookPublicViewSeed,
  StorybookResumeSeed,
} from '@/storybook/types'

const buildResumeSeed = (seed?: StorybookResumeSeed) => {
  const resumeDisplayTheme = {
    ...DEFAULT_RESUME_THEME,
    ...(seed?.resumeDisplay?.theme ?? {}),
    typography: {
      ...DEFAULT_RESUME_THEME.typography,
      ...(seed?.resumeDisplay?.theme?.typography ?? {}),
    },
    margins: {
      ...DEFAULT_RESUME_MARGINS,
      ...(seed?.resumeDisplay?.theme?.margins ?? {}),
    },
  }

  return {
    id: seed?.id ?? null,
    slug: seed?.slug ?? null,
    editSecret: seed?.editSecret ?? 'storybook-secret',
    resumeTitle: seed?.resumeTitle ?? DEFAULT_RESUME_TITLE,
    markdown: seed?.markdown ?? DEFAULT_RESUME,
    saveStatus: seed?.saveStatus ?? 'saved',
    syncStatus: seed?.syncStatus ?? 'unsaved',
    isPublished: seed?.isPublished ?? false,
    imageWarning: seed?.imageWarning ?? null,
    contentWarning: seed?.contentWarning ?? null,
    resumeDisplay: {
      themeMode: seed?.resumeDisplay?.themeMode ?? 'auto',
      theme: resumeDisplayTheme,
    },
  }
}

const buildEditorViewSeed = (seed?: StorybookEditorViewSeed) => {
  return {
    editorViewState: {
      preview: seed?.editorViewState?.preview ?? true,
      previewOnly: seed?.editorViewState?.previewOnly ?? false,
      htmlPreview: seed?.editorViewState?.htmlPreview ?? false,
    },
    isSyncScrollEnabled: seed?.isSyncScrollEnabled ?? true,
  }
}

const buildPublicViewSeed = (seed?: StorybookPublicViewSeed) => {
  return {
    publicViewState: {
      isPreviewMode: seed?.isPreviewMode ?? false,
    },
  }
}

interface StorybookStoreSeeds {
  resume?: StorybookResumeSeed
  editorView?: StorybookEditorViewSeed
  publicView?: StorybookPublicViewSeed
}

interface StoryStoreSeederProps {
  stores?: StorybookStoreSeeds
  children: ReactNode
}

function StoryStoreSeeder({ stores, children }: StoryStoreSeederProps) {
  const initialStoresRef = useRef(stores)

  useEffect(() => {
    const initialStores = initialStoresRef.current

    useResumeStore.persist?.clearStorage?.()
    useEditorViewStore.persist?.clearStorage?.()

    useResumeStore.setState(buildResumeSeed(initialStores?.resume))
    useEditorViewStore.setState(buildEditorViewSeed(initialStores?.editorView))
    usePublicViewStore.setState(buildPublicViewSeed(initialStores?.publicView))
  }, [])

  return <>{children}</>
}

export const withStores: Decorator = (Story, context) => {
  const parameters = context.parameters as StorybookParameters
  const stores = parameters.tidyresume?.stores

  return (
    <StoryStoreSeeder key={context.id} stores={stores}>
      <Story />
    </StoryStoreSeeder>
  )
}
