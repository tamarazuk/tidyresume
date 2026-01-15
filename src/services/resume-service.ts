import { PrismaClient } from '@prisma/client'

export async function getResume(prisma: PrismaClient, idOrSlug: string) {
  // Try finding by ID first
  let resume = await prisma.resume.findUnique({
    where: { id: idOrSlug },
  })

  // If not found, try finding by Slug
  if (!resume) {
    resume = await prisma.resume.findUnique({
      where: { slug: idOrSlug },
    })
  }

  return resume
}

export async function deleteResume(prisma: PrismaClient, id: string) {
  return prisma.resume.delete({
    where: { id },
  })
}

export async function publishResume(
  prisma: PrismaClient,
  data: {
    id?: string
    title: string
    content: string
    slug?: string | null
  }
) {
  let resumeId = data.id

  if (!resumeId) {
    resumeId = crypto.randomUUID()
  }

  // Check slug uniqueness if provided
  if (data.slug) {
    const existing = await prisma.resume.findUnique({
      where: { slug: data.slug },
    })

    // If slug exists and belongs to a DIFFERENT resume, throw error
    if (existing && existing.id !== resumeId) {
      throw new Error('Slug already taken')
    }
  }

  const updateData: {
    title: string
    content: string
    slug?: string | null
  } = {
    title: data.title,
    content: data.content,
  }

  if (Object.prototype.hasOwnProperty.call(data, 'slug')) {
    updateData.slug = data.slug ?? null
  }

  return prisma.resume.upsert({
    where: { id: resumeId },
    update: updateData,
    create: {
      id: resumeId,
      title: data.title,
      content: data.content,
      slug: data.slug ?? null,
    },
  })
}
