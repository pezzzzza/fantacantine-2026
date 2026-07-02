import { Grape, Wine, GlassWater, Music, Leaf, Container } from 'lucide-react'
import type { Crest } from '@/lib/leaderboard-data'

const ICONS: Record<Crest, typeof Grape> = {
  grape: Grape,
  glass: GlassWater,
  barrel: Container,
  music: Music,
  leaf: Leaf,
  corkscrew: Wine,
  wine: Wine,
}

export function TeamCrest({ crest, color }: { crest: Crest; color: string }) {
  const Icon = ICONS[crest]
  return (
    <div
      className="relative flex h-11 w-10 items-center justify-center rounded-md rounded-b-[14px] shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
      style={{
        background: `linear-gradient(155deg, ${color}, ${color}cc)`,
        border: '2px solid #e8c46a',
        clipPath:
          'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)',
      }}
      aria-hidden
    >
      <Icon className="h-5 w-5 text-gold-bright drop-shadow" strokeWidth={2} />
    </div>
  )
}
