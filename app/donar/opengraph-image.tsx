import { ImageResponse } from 'next/og'

export const alt = 'Donar - Key Rescata'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#3D405B',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: 32,
            padding: '48px 64px',
            gap: 16,
          }}
        >
          {/* Icono simple: circulo con corazon */}
          <div
            style={{
              display: 'flex',
              width: 96,
              height: 96,
              borderRadius: 999,
              background: '#E07A5F',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 48, color: 'white', fontWeight: 900, lineHeight: 1 }}>$</span>
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: '#3D405B',
              lineHeight: 1,
            }}
          >
            Donar
          </span>
          <span style={{ fontSize: 18, color: '#6B7280', fontWeight: 600 }}>Key Rescata</span>
          <span
            style={{
              fontSize: 14,
              color: '#3D405B',
              background: '#F4F1DE',
              padding: '8px 16px',
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            keyrescata.netlify.app/donar
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
