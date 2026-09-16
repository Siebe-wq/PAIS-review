import { formatScore, scoreBand } from '@/lib/types';

export function ScoreBadge({ score }: { score: number }) {
  const band = scoreBand(score);
  return (
    <div className="score" data-tone={band.tone} title={`${formatScore(score)} out of 10 — ${band.label}`}>
      <span className="num">{formatScore(score)}</span>
      <span className="den">/ 10</span>
      <span className="band">{band.label}</span>
    </div>
  );
}
