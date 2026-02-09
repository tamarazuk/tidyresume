import type {
  ResumeId,
  ResumeLabel,
  ResumeRecord,
  ResumeSlug,
  ResumeThemeSettings,
} from '@/types/resume'

export interface PublishResumePayload {
  id?: ResumeId
  title: string
  content: string
  slug?: ResumeSlug
  theme?: ResumeThemeSettings | null
  labels?: ResumeLabel[] | null
}

export interface PublishResumeResponse {
  id: ResumeId
  slug: ResumeSlug
  url?: string
  editSecret?: string
  created: boolean
}

export interface UpdateResumeSlugResponse {
  id: ResumeId
  slug: ResumeSlug
  url?: string
}

export interface UpdateResumeThemeResponse {
  id: ResumeId
  theme?: ResumeThemeSettings | null
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
  options: { signal?: AbortSignal; editSecret?: string } = {}
): Promise<PublishResumeResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (options.editSecret) {
    headers['X-Edit-Secret'] = options.editSecret
  }

  const response = await fetch('/api/resumes/publish', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: options.signal,
  })

  return parseJsonResponse<PublishResumeResponse>(
    response,
    'Failed to publish resume'
  )
}

export async function updateResumeSlug(
  id: ResumeId,
  slug: ResumeSlug,
  options: { signal?: AbortSignal; editSecret?: string } = {}
): Promise<UpdateResumeSlugResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (options.editSecret) {
    headers['X-Edit-Secret'] = options.editSecret
  }

  const response = await fetch(`/api/resumes/${id}/slug`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ slug }),
    signal: options.signal,
  })

  return parseJsonResponse<UpdateResumeSlugResponse>(
    response,
    'Failed to update slug'
  )
}

export async function updateResumeTheme(
  id: ResumeId,
  theme: ResumeThemeSettings | null,
  options: { signal?: AbortSignal; editSecret?: string } = {}
): Promise<UpdateResumeThemeResponse> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (options.editSecret) {
    headers['X-Edit-Secret'] = options.editSecret
  }

  const response = await fetch(`/api/resumes/${id}/theme`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ theme }),
    signal: options.signal,
  })

  return parseJsonResponse<UpdateResumeThemeResponse>(
    response,
    'Failed to update theme'
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
  options: { signal?: AbortSignal; editSecret?: string | null } = {}
): Promise<{ success: boolean }> {
  const headers: HeadersInit = {}
  if (options.editSecret) {
    headers['X-Edit-Secret'] = options.editSecret
  }

  const response = await fetch(`/api/resumes/${id}`, {
    method: 'DELETE',
    headers,
    signal: options.signal,
  })

  return parseJsonResponse<{ success: boolean }>(
    response,
    'Failed to delete resume'
  )
}
