import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publishResume } from '../resume-service'

// Mock the schema
vi.mock('@/db/schema', async () => {
  const actual = await vi.importActual('@/db/schema')
  return {
    ...actual,
    resumes: {
      id: 'resumes',
      title: 'title',
      content: 'content',
      slug: 'slug',
      editSecret: 'editSecret',
      updatedAt: 'updatedAt',
    },
  }
})

describe('publishResume (Unpublish/Republish Scenario)', () => {
  const mockDb = {
    insert: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should ensure an editSecret is present in values even if ID is provided (handling republish)', async () => {
    // Setup the chain: insert().values().onConflictDoUpdate().returning() -> resolves to array
    const returningMock = vi
      .fn()
      .mockResolvedValue([{ editSecret: 'new-secret-from-db' }])
    const onConflictDoUpdateMock = vi
      .fn()
      .mockReturnValue({ returning: returningMock })
    const valuesMock = vi
      .fn()
      .mockReturnValue({ onConflictDoUpdate: onConflictDoUpdateMock })

    mockDb.insert.mockReturnValue({ values: valuesMock })

    const result = await publishResume(mockDb, {
      id: 'existing-id',
      title: 'Title',
      content: 'Content',
    })

    // 1. Verify we called values()
    expect(valuesMock).toHaveBeenCalled()
    const valuesCall = valuesMock.mock.calls[0][0]

    // CRITICAL: We expect editSecret to be generated and passed in values
    // even though ID was provided.
    expect(valuesCall.editSecret).toBeDefined()
    expect(typeof valuesCall.editSecret).toBe('string')

    // 2. Verify we return the secret from the DB
    expect(result.editSecret).toBe('new-secret-from-db')
  })
})
