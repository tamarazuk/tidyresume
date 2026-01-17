import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/db'
import * as resumeService from '@/services/resume-service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    const resume = await resumeService.getResume(db, id)

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deleteSecret: _deleteSecret, userEmail: _userEmail, ...safeResume } = resume
    return NextResponse.json(safeResume)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { env } = await getCloudflareContext({ async: true })
    const db = getDb(env.DB)

    const resume = await resumeService.getResume(db, id)

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const secretHeader = request.headers.get('X-Delete-Secret')
    
    // Resume must have a deleteSecret to be deleted via this API
    // If it doesn't (legacy?), we might default to blocking or allowing.
    // Given the migration, all new ones have it. 
    // Secure by default: Block if secret mismatch.
    
    if (!resume.deleteSecret || secretHeader !== resume.deleteSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await resumeService.deleteResume(db, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}
