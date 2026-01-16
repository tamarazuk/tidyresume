import { create } from 'zustand'

interface PublicViewState {
  isPreviewMode: boolean
}

interface PublicViewStore {
  publicViewState: PublicViewState
  setPublicViewState: (next: Partial<PublicViewState>) => void
}

export const usePublicViewStore = create<PublicViewStore>((set) => ({
  publicViewState: {
    isPreviewMode: false,
  },
  setPublicViewState: (next) =>
    set((state) => ({
      publicViewState: {
        ...state.publicViewState,
        ...next,
      },
    })),
}))
