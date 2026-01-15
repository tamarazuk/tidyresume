import type { ResumeId, ResumeRecord, ResumeSlug } from '@/lib/resume-types'

export interface PublishResumePayload {
  id?: ResumeId
  title: string
  content: string
  slug?: ResumeSlug
}

export interface PublishResumeResponse {
  id: ResumeId
  slug: ResumeSlug
  url?: string
}

export class ResumeApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ResumeApiError'
    this.status = status
  }
}

export function isResumeApiError(error: unknown): error is ResumeApiError {
  return error instanceof ResumeApiError
}

async function parseJsonResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T
  }

  let message = fallbackMessage
  try {
    const data = (await response.json()) as { error?: string }
    if (data?.error) {
      message = data.error
    }
  } catch {
    // Ignore JSON parsing errors and fall back to the generic message.
  }

  throw new ResumeApiError(message, response.status)
}

export async function publishResume(
  payload: PublishResumePayload,
  options: { signal?: AbortSignal } = {}
): Promise<PublishResumeResponse> {
  const response = await fetch('/api/resumes/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: options.signal,
  })

  return parseJsonResponse<PublishResumeResponse>(
    response,
    'Failed to publish resume'
  )
}

export async function fetchResume(
  idOrSlug: string,
  options: { signal?: AbortSignal } = {}
): Promise<ResumeRecord> {
  const response = await fetch(`/api/resumes/${idOrSlug}`, {
    method: 'GET',
    signal: options.signal,
  })

  return parseJsonResponse<ResumeRecord>(response, 'Failed to fetch resume')
}

export async function deleteResume(
  id: string,
  options: { signal?: AbortSignal } = {}
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/resumes/${id}`, {
    method: 'DELETE',
    signal: options.signal,
  })

  return parseJsonResponse<{ success: boolean }>(
    response,
    'Failed to delete resume'
  )
}
