import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { PublicResumeView } from '@/components/public-view/public-resume-view'
import { ViralLoopCTA } from '@/components/public-view/viral-loop-cta'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getResume(id: string) {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)
    return resumeService.getResume(db, id)
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resume = await getResume(slug)

  if (!resume) {
    return {
      title: 'Resume Not Found',
    }
  }

  return {
    title: `${resume.title} - TidyResume`,
    description: 'Created with TidyResume',
    openGraph: {
      type: 'article',
      title: resume.title,
      description: 'View this resume on TidyResume',
    },
  }
}

export default async function PublicResumePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resume = await getResume(slug)

  if (!resume) {
    notFound()
  }

  return (
    <div className="bg-background relative min-h-screen print:bg-white">
      <PublicResumeView
        id={resume.id}
        title={resume.title}
        content={resume.content}
        theme={resume.theme ?? null}
      />
      <ViralLoopCTA resumeId={resume.id} />
    </div>
  )
}
