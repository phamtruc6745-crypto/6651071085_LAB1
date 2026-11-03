import { useEffect, useState } from 'react'

export function useSkeleton(key: string, delayMs: number): boolean {
  const [readyKey, setReadyKey] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReadyKey(key)
    }, delayMs)
    return () => {
      clearTimeout(timer)
    }
  }, [key, delayMs])

  return readyKey !== key
}
