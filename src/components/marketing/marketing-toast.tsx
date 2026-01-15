'use client'

import { useMarketingToast } from '@/hooks/use-marketing-toast'

export default function MarketingToast() {
  // Client-only hook needed for search params + toast side effects in a server layout.
  useMarketingToast()

  return null
}
