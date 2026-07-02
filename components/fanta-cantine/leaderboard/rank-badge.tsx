import { Medal } from 'lucide-react'

const MEDALS: Record<number, { ring: string; face: string; ribbon: string }> = {
  1: { ring: '#f6d97e', face: '#e8b423', ribbon: '#b8912f' },
  2: { ring: '#e4e7ec', face: '#c4c9d2', ribbon: '#8b93a1' },
  3: { ring: '#e3a06a', face: '#c9773c', ribbon: '#9c5427' },
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const c = MEDALS[rank]
    return (
      <div className="relative flex h-11 w-11 items-center justify-center">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-night-deep shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${c.ring}, ${c.face})`,
            border: `2px solid ${c.ribbon}`,
          }}
          aria-hidden
        >
          <Medal className="absolute h-4 w-4 opacity-30" style={{ color: c.ribbon }} />
          {rank}
        </span>
        <span className="sr-only">Posizione {rank}</span>
      </div>
    )
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center">
      <span className="font-display text-2xl font-bold text-wine-text">
        {rank}
      </span>
    </div>
  )
}
