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
    update: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the existing editSecret when updating with an ID', async () => {
    const returningMock = vi.fn().mockResolvedValue([
      { id: 'existing-id', editSecret: 'existing-secret', slug: null },
    ])
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock })
    const setMock = vi.fn().mockReturnValue({ where: whereMock })

    mockDb.update.mockReturnValue({ set: setMock })

    const result = await publishResume(mockDb, {
      id: 'existing-id',
      title: 'Title',
      content: 'Content',
    })

    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.insert).not.toHaveBeenCalled()
    expect(result.editSecret).toBe('existing-secret')
  })
})
