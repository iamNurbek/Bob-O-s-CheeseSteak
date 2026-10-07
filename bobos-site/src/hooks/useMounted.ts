import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** True only on the client after hydration; use to avoid hydration mismatches. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
