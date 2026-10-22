import { ImageResponse } from 'next/og';
import { getSiteText } from '@/lib/site-text';
import { OG_SIZE, OgCard, clip } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'PAIS Reviews';

export default function Image() {
  const text = getSiteText();
  return new ImageResponse(
    <OgCard siteName={text['site.name']} heading={text['site.name']} text={clip(text['site.description'], 230)} />,
    size,
  );
}
