import { ImageResponse } from '@/lib/og';

export const runtime = 'edge';
export const alt = 'Find the best AI tools for commercial real estate';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#0b1020',
          padding: '80px',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            maxWidth: 1000,
          }}
        >
          Find the best AI tools for commercial real estate
        </div>
      </div>
    ),
    size
  );
}

