import { ImageResponse } from 'next/og';
export { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const OG_WIDTH = siteConfig.seo.openGraph.images.width || 1200;
export const OG_HEIGHT = siteConfig.seo.openGraph.images.height || 630;

type BackgroundStyle = 'light' | 'dark' | 'gradient';

export interface CreateOgImageOptions {
  title: string;
  subtitle?: string;
  badge?: string;
  footer?: string;
  accentColorHex?: string;
  background?: BackgroundStyle;
}

/**
 * Generate a clean Open Graph/Twitter image with consistent branding.
 * Uses inline styles only (no Tailwind) to ensure reliability in edge runtime.
 */
export async function createOgImage(options: CreateOgImageOptions): Promise<ImageResponse> {
  const {
    title,
    subtitle,
    badge = siteConfig.categoryName,
    footer = siteConfig.url.replace(/^https?:\/\//, ''),
    accentColorHex = '#0f172a',
    background = 'gradient',
  } = options;

  const backgroundStyle = (() => {
    if (background === 'light') {
      return 'linear-gradient(180deg, #ffffff 0%, #f6f7f9 100%)';
    }
    if (background === 'dark') {
      return 'radial-gradient(1200px 600px at 0% 0%, #0b1020 0%, #0a0e1a 40%, #05070d 100%)';
    }
    return 'radial-gradient(1200px 600px at 0% 0%, #f8fafc 0%, #eef2f7 40%, #e6ebf2 100%)';
  })();

  const subtleGrid = `repeating-linear-gradient(90deg, rgba(15,23,42,0.04) 0px, rgba(15,23,42,0.04) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(0deg, rgba(15,23,42,0.04) 0px, rgba(15,23,42,0.04) 1px, transparent 1px, transparent 24px)`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          backgroundImage: `${backgroundStyle}, ${subtleGrid}`,
          backgroundSize: 'cover, auto',
          backgroundColor: '#ffffff',
          color: '#0b1020',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji',
        }}
      >
        {/* Header badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(2, 6, 23, 0.06)',
              border: '1px solid rgba(15, 23, 42, 0.12)',
              fontSize: 20,
              lineHeight: 1.2,
              color: '#0f172a',
              fontWeight: 600,
            }}
          >
            {badge}
          </div>
        </div>

        {/* Title and subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0b1020',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: 'rgba(15, 23, 42, 0.75)',
                maxWidth: 1000,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: accentColorHex,
                boxShadow: `0 0 0 6px ${hexToRgba(accentColorHex, 0.15)}`,
              }}
            />
            <div style={{ fontSize: 22, color: 'rgba(15,23,42,0.8)', fontWeight: 600 }}>{siteConfig.name}</div>
          </div>
          <div style={{ fontSize: 22, color: 'rgba(15,23,42,0.6)' }}>{footer}</div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      // Fonts intentionally omitted for reliability; system UI renders crisply
    }
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

