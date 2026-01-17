'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            '!bg-emerald-600 !text-white !border-emerald-600/80 hover:!bg-emerald-600/90 dark:!bg-emerald-500 dark:!text-emerald-950 dark:!border-emerald-400/70 dark:hover:!bg-emerald-500/90',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      richColors
      {...props}
      position="top-center"
    />
  )
}

export { Toaster }
