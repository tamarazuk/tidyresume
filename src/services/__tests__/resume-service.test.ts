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
    // .returning() mock needed:
    const returningMock = vi
      .fn()
      .mockResolvedValue([{ id: 'id', editSecret: 'ds' }])

    // In the failing test case, onConflictDoUpdate throws, so returning won't be called,
    // BUT the mock setup in beforeEach needs to handle the structure.
    // AND the implementation calls .returning() AFTER .onConflictDoUpdate().

    // The implementation:
    // await db.insert().values().onConflictDoUpdate().returning()

    // So onConflictDoUpdate should return an object that has .returning()
    onConflictDoUpdateMock.mockReturnValue({ returning: returningMock })

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

    uniqueConstraintError.cause = { code: 'SQLITE_CONSTRAINT' }

    const valuesMock = mockDb.insert().values
    const onConflictDoUpdateMock = valuesMock().onConflictDoUpdate

    // The implementation calls .returning(), so we must simulate the error there
    // because .onConflictDoUpdate is now a builder step, not the final awaitable.
    onConflictDoUpdateMock.mockReturnValueOnce({
      returning: vi.fn().mockRejectedValueOnce(uniqueConstraintError),
    })

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
})
