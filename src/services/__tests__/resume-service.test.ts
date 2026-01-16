import { describe, it, expect, vi, beforeEach } from 'vitest'
import { publishResume } from '../resume-service'

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

    // Setup insert chain mock
    const onConflictDoUpdateMock = vi.fn().mockResolvedValue(undefined)
    const valuesMock = vi.fn().mockReturnValue({
      onConflictDoUpdate: onConflictDoUpdateMock,
    })
    mockDb.insert.mockReturnValue({
      values: valuesMock,
    })
  })

  it('should throw "Slug already taken" when insert fails with unique constraint violation', async () => {
    // Simulate Race Condition:
    // 1. Pre-check passes (findFirst returns null/undefined)
    mockDb.query.resumes.findFirst.mockResolvedValue(undefined)

    // 2. Insert fails with unique constraint error
    // We simulate a D1/SQLite unique constraint error
    const uniqueConstraintError = new Error(
      'D1_ERROR: UNIQUE constraint failed: resumes.slug'
    )
    // @ts-expect-error -- Simulating potential driver shapes
    uniqueConstraintError.cause = { code: 'SQLITE_CONSTRAINT' }

    const valuesMock = mockDb.insert().values
    valuesMock().onConflictDoUpdate.mockRejectedValueOnce(uniqueConstraintError)

    await expect(
      publishResume(mockDb, {
        title: 'Test Resume',
        content: 'Markdown content',
        slug: 'taken-slug',
      })
    ).rejects.toThrow('Slug already taken')
  })
})