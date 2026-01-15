import { useResumeStore } from '@/stores/resume-store'

export function useOwnerCheck(viewId: string) {
    const localId = useResumeStore((state) => state.id)
    return localId === viewId
}
