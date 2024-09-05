// https://github.com/sushiswap/sushiswap/blob/7b80a1ad19c129eb964b9e699c025f0f61eb8b2d/packages/hooks/src/useIsMounted.ts
// tracks whether the component using the hook has been mounted (i.e., rendered into the DOM)
'use client'

import { useEffect, useState } from 'react'

export function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted
}
