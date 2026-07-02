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
        !isLast && !team.isUser ? 'border-b border-[#d4c9b8]' : '',
        team.isUser
          ? 'my-1 rounded-2xl border-2 border-[#e8c46a] bg-[#e8c46a]/15 shadow-[0_2px_10px_rgba(232,196,106,0.35)]'
          : '',
      ].join(' ')}
    >
      {team.isUser ? (
        <div className="relative flex h-11 w-11 items-center justify-center">
          <Star className="h-10 w-10 text-[#e8c46a]" fill="#e8c46a" />
          <span className="absolute text-[10px] font-black text-[#14213d]">
            TU
          </span>
        </div>
      ) : (
        <RankBadge rank={team.rank} />
      )}

      <TeamCrest crest={team.crest} color={team.crestColor} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold leading-tight text-[#14213d] uppercase">
          {team.name}
        </p>
        <p className="truncate text-xs font-medium text-[#14213d]/70 uppercase">
          Allenatore: {team.coach}
        </p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-black text-[#14213d]">
          {team.points}
        </span>
        <span className="text-sm font-medium text-[#14213d]/70">pt</span>
      </div>
    </motion.li>
  )
}
