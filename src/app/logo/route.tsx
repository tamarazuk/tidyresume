import { ImageResponse } from 'next/og'
import AppIcon from '@/icons/app-icon'

export const runtime = 'edge'

/**
 * Serves the standard brand logo (non-favicon variant) as a PNG.
 * This is used for emails and other external contexts where the
 * sharper, less-rounded version is preferred.
 */
export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <AppIcon
        variant="default"
        className=""
        style={{ width: '100%', height: '100%' }}
      />
    </div>,
    {
      width: 512,
      height: 512,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
