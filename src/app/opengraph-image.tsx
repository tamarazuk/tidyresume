import { ImageResponse } from 'next/og'

export const alt = 'TidyResume - Markdown Resume Builder'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

async function fetchFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(url)
    if (!cssRes.ok) {
      console.warn(
        `[og] Failed to fetch Google Fonts CSS: ${url} (status ${cssRes.status})`
      )
      return null
    }
    const css = await cssRes.text()
    const match = css.match(/src: url\(([^)]+)\)/)
    if (!match) {
      console.warn(
        `[og] Could not extract font URL from Google Fonts CSS: ${url}`
      )
      return null
    }
    const fontUrl = match[1].replace(/['"]/g, '').trim()
    const fontRes = await fetch(fontUrl)
    if (!fontRes.ok) {
      console.warn(
        `[og] Failed to fetch font file: ${fontUrl} (status ${fontRes.status})`
      )
      return null
    }
    return await fontRes.arrayBuffer()
  } catch (e) {
    console.warn(`[og] Failed to fetch font: ${url}`, e)
    return null
  }
}

export default async function Image() {
  const [sourceSerif, notoSans] = await Promise.all([
    fetchFont(
      'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap'
    ),
    fetchFont(
      'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500&display=swap'
    ),
  ])

  return new ImageResponse(
    <div
      style={{
        background: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#6366F1"
            d="M0 12A12 12 0 0 1 12 0h76a12 12 0 0 1 12 12v18H0zM0 36h40a6 6 0 0 1 6 6v58H12a12 12 0 0 1-12-12zM54 42a6 6 0 0 1 6-6h40v52a12 12 0 0 1-12 12H54z"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: 72,
          fontFamily: '"Source Serif 4"',
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: 10,
          letterSpacing: '-0.015em',
        }}
      >
        TidyResume
      </div>
      <div
        style={{
          fontSize: 36,
          fontFamily: '"Noto Sans"',
          fontWeight: 500,
          color: '#64748b',
        }}
      >
        Markdown Resume Builder
      </div>
    </div>,
    {
      ...size,
      fonts: [
        ...(sourceSerif
          ? [
              {
                name: 'Source Serif 4',
                data: sourceSerif,
                weight: 600 as const,
                style: 'normal' as const,
              },
            ]
          : []),
        ...(notoSans
          ? [
              {
                name: 'Noto Sans',
                data: notoSans,
                weight: 500 as const,
                style: 'normal' as const,
              },
            ]
          : []),
      ],
    }
  )
}
