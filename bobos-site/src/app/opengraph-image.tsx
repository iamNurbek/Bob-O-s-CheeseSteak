import { ImageResponse } from 'next/og'

import { BRAND_HEX } from '@/constants/brand'
import { FULL_ADDRESS, SITE } from '@/data/site'

export const alt = `${SITE.name}: ${SITE.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        background: BRAND_HEX.bgLight,
        color: BRAND_HEX.text,
        borderBottom: `24px solid ${BRAND_HEX.primary}`,
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 900, fontStyle: 'italic', color: BRAND_HEX.primary }}>
        {SITE.name}
      </div>
      <div style={{ fontSize: 56, fontWeight: 800, marginTop: 16 }}>{SITE.tagline}</div>
      <div style={{ fontSize: 32, marginTop: 32 }}>{`${FULL_ADDRESS} · Concept demo`}</div>
    </div>,
    size,
  )
}
