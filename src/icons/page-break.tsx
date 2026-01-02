import * as React from 'react'

type PageBreakIconProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'width' | 'height'
> & {
  size?: number | string
  strokeWidth?: number
  title?: string
}

export function PageBreakIcon({
  size = 24,
  strokeWidth = 1, // lightest
  title,
  ...props
}: PageBreakIconProps) {
  const ariaProps = title
    ? { role: 'img' as const, 'aria-label': title }
    : { role: 'presentation' as const, 'aria-hidden': true as const }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...ariaProps}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      {/* top segment */}
      <path d="M6 5v4" />
      <path d="M6 9h12" />
      <path d="M18 5v4" />

      {/* dotted break */}
      <path d="M7 12h10" strokeDasharray="1 3" />

      {/* bottom segment */}
      <path d="M6 19v-4" />
      <path d="M6 15h12" />
      <path d="M18 15v4" />
    </svg>
  )
}
