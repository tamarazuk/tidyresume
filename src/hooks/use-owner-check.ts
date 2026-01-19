import { useResumeStore } from '@/stores/resume-store'

export function useOwnerCheck(viewId: string) {
  const hasResume = useResumeStore((state) => {
    if (state.id === viewId) return true
    return state.resumes.some((resume) => resume.id === viewId)
  })
  return hasResume
}
