import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export function getDb(dbBinding: D1Database) {
    const adapter = new PrismaD1(dbBinding)
    return new PrismaClient({ adapter })
}
