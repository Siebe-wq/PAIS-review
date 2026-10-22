import type { Tone } from '@/lib/types';

/** Link-preview cards (Bluesky, X, messaging apps). Light theme colours from globals.css. */
export const OG_SIZE = { width: 1200, height: 630 };

const TONES: Record<Tone, { fg: string; bg: string; br: string }> = {
  strong: { fg: '#17603a', bg: '#dcf0e4', br: '#a8d8bd' },
  solid: { fg: '#1a5478', bg: '#dbecf7', br: '#a4cde6' },
  borderline: { fg: '#7a5410', bg: '#f8ecd2', br: '#e3c98c' },
  weak: { fg: '#8a3d16', bg: '#fae3d6', br: '#eeb896' },
  fatal: { fg: '#8e2222', bg: '#fadede', br: '#efadad' },
  neutral: { fg: '#6b6862', bg: '#f4f4f2', br: '#cfcdc7' },
};

export function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export function OgCard(props: {
  siteName: string;
  heading: string;
  text: string;
  badge?: { headline: string; label: string; tone: Tone; showDenominator: boolean };
}) {
  const tone = props.badge ? TONES[props.badge.tone] : null;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fbfbfa', color: '#1c1b19', padding: '56px 64px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: '#6b6862' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 10, background: '#1c1b19', color: '#e8c581', fontSize: 32, fontWeight: 700 }}>P</div>
        {props.siteName}
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 48, marginTop: 24 }}>
        {props.badge && tone && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 200, padding: '24px 20px', borderRadius: 18, background: tone.bg, border: `3px solid ${tone.br}`, color: tone.fg }}>
            <div style={{ fontSize: props.badge.headline.length > 4 ? 44 : 96, fontWeight: 700, lineHeight: 1 }}>{props.badge.headline}</div>
            {props.badge.showDenominator && <div style={{ fontSize: 28, marginTop: 4 }}>/ 10</div>}
            <div style={{ fontSize: 28, marginTop: 10 }}>{props.badge.label}</div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 20 }}>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.2 }}>{props.heading}</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: '#45423d' }}>{props.text}</div>
        </div>
      </div>
    </div>
  );
}
