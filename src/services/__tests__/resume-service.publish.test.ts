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
      theme: 'theme',
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

  it('should update an existing resume when ID is found', async () => {
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
    expect(result.created).toBe(false)
  })

  it('should serialize theme when updating with an ID', async () => {
    const returningMock = vi.fn().mockResolvedValue([
      { id: 'existing-id', editSecret: 'existing-secret', slug: null },
    ])
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock })
    const setMock = vi.fn().mockReturnValue({ where: whereMock })

    mockDb.update.mockReturnValue({ set: setMock })

    await publishResume(mockDb, {
      id: 'existing-id',
      title: 'Title',
      content: 'Content',
      theme: {
        accent: 'teal',
        typography: { heading: 'geologica', body: 'noto-sans' },
      },
    })

    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: JSON.stringify({
          accent: 'teal',
          typography: { heading: 'geologica', body: 'noto-sans' },
        }),
      })
    )
  })

  it('creates a new resume when client ID is stale', async () => {
    const updateReturningMock = vi.fn().mockResolvedValue([])
    const updateWhereMock = vi
      .fn()
      .mockReturnValue({ returning: updateReturningMock })
    const updateSetMock = vi.fn().mockReturnValue({ where: updateWhereMock })
    mockDb.update.mockReturnValue({ set: updateSetMock })

    const insertReturningMock = vi.fn().mockResolvedValue([
      { id: 'new-id', editSecret: 'new-secret', slug: 'new-slug' },
    ])
    const insertValuesMock = vi
      .fn()
      .mockReturnValue({ returning: insertReturningMock })
    mockDb.insert.mockReturnValue({ values: insertValuesMock })

    const result = await publishResume(mockDb, {
      id: 'stale-id',
      title: 'Republished',
      content: 'Content',
      slug: 'new-slug',
    })

    expect(mockDb.update).toHaveBeenCalled()
    expect(mockDb.insert).toHaveBeenCalled()
    expect(result.id).toBe('new-id')
    expect(result.editSecret).toBe('new-secret')
    expect(result.slug).toBe('new-slug')
    expect(result.created).toBe(true)
  })
})
