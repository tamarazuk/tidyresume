import { ImageResponse } from 'next/og'
import AppIcon from '@/icons/app-icon'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Tidy Resume'
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

/**
 * Generates the favicon dynamically using the 'favicon' variant of AppIcon.
 * This ensures consistent branding while using the optically optimized
 * more-rounded version for small browser tab contexts.
 */
export default function Icon() {
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
        variant="favicon"
        // We pass an empty className to avoid the default h-5 w-5
        // and let the style container control the size
        className=""
        style={{ width: '100%', height: '100%' }}
      />
    </div>,
    {
      ...size,
    }
  )
}
