'use client'

import { Suspense } from 'react'
import { useMarketingToast } from '@/hooks/use-marketing-toast'

function MarketingToastContent() {
  // Client-only hook needed for search params + toast side effects in a server layout.
  useMarketingToast()
  return null
}

export default function MarketingToast() {
  return (
    <Suspense fallback={null}>
      <MarketingToastContent />
    </Suspense>
  )
}
