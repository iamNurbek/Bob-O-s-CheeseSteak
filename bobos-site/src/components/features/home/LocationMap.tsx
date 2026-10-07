'use client'

import { useEffect, useRef, useState } from 'react'

import { FULL_ADDRESS, SITE } from '@/data/site'

/**
 * The Maps embed pulls ~450 KB of third-party script, so it only mounts once the
 * box is actually on screen; until then the box shows the address.
 */
export function LocationMap() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box || isVisible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div
      ref={boxRef}
      className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-control border border-border bg-surface-alt"
    >
      {isVisible ? (
        <iframe
          title={`Map showing ${SITE.name} at ${FULL_ADDRESS}`}
          src={SITE.mapEmbedUrl}
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full"
        />
      ) : (
        <p className="p-4 text-center font-semibold text-muted">Map of {FULL_ADDRESS}</p>
      )}
    </div>
  )
}
