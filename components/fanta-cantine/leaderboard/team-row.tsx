'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Team } from '@/lib/leaderboard-data'
import { RankBadge } from './rank-badge'
import { TeamCrest } from './team-crest'

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function TeamRow({ team, isLast }: { team: Team; isLast: boolean }) {
  return (
    <motion.li
      variants={rowVariants}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className={[
        'flex items-center gap-3 px-3 py-3',
        !isLast && !team.isUser ? 'border-b border-parchment-line' : '',
        team.isUser
          ? 'my-1 rounded-2xl border-2 border-gold bg-gold/15 shadow-[0_2px_10px_rgba(232,196,106,0.35)]'
          : '',
      ].join(' ')}
    >
      {team.isUser ? (
        <div className="relative flex h-11 w-11 items-center justify-center">
          <Star className="h-10 w-10 text-gold" fill="#e8c46a" />
          <span className="absolute text-[10px] font-black text-night-deep">
            TU
          </span>
        </div>
      ) : (
        <RankBadge rank={team.rank} />
      )}

      <TeamCrest crest={team.crest} color={team.crestColor} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold leading-tight text-cream-ink uppercase">
          {team.name}
        </p>
        <p className="truncate text-xs text-cream-ink/60 uppercase">
          Allenatore: {team.coach}
        </p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-black text-wine-text">
          {team.points}
        </span>
        <span className="text-sm font-medium text-cream-ink/50">pt</span>
      </div>
    </motion.li>
  )
}
