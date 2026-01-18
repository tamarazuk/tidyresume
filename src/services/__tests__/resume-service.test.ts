import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getResume, publishResume } from '../resume-service'

// Mock the schema to avoid actual DB calls if any
vi.mock('@/db/schema', async () => {
  const actual = await vi.importActual('@/db/schema')
  return {
    ...actual,
    resumes: { id: 'resumes' }, // simple mock for table object
  }
})

describe('resume-service', () => {
  const mockDb = {
    query: {
      resumes: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as unknown as any // using any here for the mock DB because typing Drizzle mock fully is verbose, but eslint might complain.
  // Wait, I should use unknown as ... or disable rule.
  // Using unknown as Db type requires importing Db type.

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw "Slug already taken" when insert fails with unique constraint violation', async () => {
    // Insert fails with unique constraint error
    // We simulate a D1/SQLite unique constraint error
    const uniqueConstraintError = new Error(
      'D1_ERROR: UNIQUE constraint failed: resumes.slug'
    )

    uniqueConstraintError.cause = { code: 'SQLITE_CONSTRAINT' }

    const returningMock = vi.fn().mockRejectedValueOnce(uniqueConstraintError)
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock })
    mockDb.insert.mockReturnValue({ values: valuesMock })

    await expect(
      publishResume(mockDb, {
        title: 'Test Resume',
        content: 'Markdown content',
        slug: 'taken-slug',
      })
    ).rejects.toThrow('Slug already taken')
  })

  it('should throw "Slug already taken" when update fails with unique constraint violation', async () => {
    const updateMock = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi
            .fn()
            .mockRejectedValue(
              new Error('D1_ERROR: UNIQUE constraint failed: resumes.slug')
            ),
        }),
      }),
    })

    mockDb.update = updateMock

    await expect(
      publishResume(mockDb, {
        id: 'existing-id',
        title: 'Updated Title',
        content: 'Updated content',
        slug: 'taken-slug',
      })
    ).rejects.toThrow('Slug already taken')
  })

  it('should serialize theme when inserting', async () => {
    const returningMock = vi.fn().mockResolvedValue([
      { id: 'new-id', editSecret: 'secret', slug: null },
    ])
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock })
    mockDb.insert.mockReturnValue({ values: valuesMock })

    await publishResume(mockDb, {
      title: 'Test Resume',
      content: 'Markdown content',
      theme: {
        accent: 'indigo',
        typography: { heading: 'geologica', body: 'noto-sans' },
      },
    })

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: JSON.stringify({
          accent: 'indigo',
          typography: { heading: 'geologica', body: 'noto-sans' },
        }),
      })
    )
  })

  it('should parse theme on getResume', async () => {
    const themeValue = JSON.stringify({
      accent: 'rose',
      typography: { heading: 'ibm-plex-serif', body: 'ibm-plex-sans' },
    })
    mockDb.query.resumes.findFirst.mockResolvedValue({
      id: 'resume-id',
      title: 'Resume',
      content: 'Content',
      slug: null,
      theme: themeValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const resume = await getResume(mockDb, 'resume-id')

    expect(resume?.theme).toEqual({
      accent: 'rose',
      typography: { heading: 'ibm-plex-serif', body: 'ibm-plex-sans' },
    })
  })
})
