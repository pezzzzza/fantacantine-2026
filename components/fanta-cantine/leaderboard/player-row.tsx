'use client'

import { motion } from 'framer-motion'
import { Star, User } from 'lucide-react'
import type { Player } from '@/lib/leaderboard-data'
import { RankBadge } from './rank-badge'

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function PlayerRow({
  player,
  isLast,
}: {
  player: Player
  isLast: boolean
}) {
  return (
    <motion.li
      variants={rowVariants}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className={[
        'flex items-center gap-3 px-3 py-3',
        !isLast && !player.isUser ? 'border-b border-[#d4c9b8]' : '',
        player.isUser
          ? 'my-1 rounded-2xl border-2 border-[#e8c46a] bg-[#e8c46a]/15 shadow-[0_2px_10px_rgba(232,196,106,0.35)]'
          : '',
      ].join(' ')}
    >
      {player.isUser ? (
        <div className="relative flex h-11 w-11 items-center justify-center">
          <Star className="h-10 w-10 text-[#e8c46a]" fill="#e8c46a" />
          <span className="absolute text-[10px] font-black text-[#14213d]">
            TU
          </span>
        </div>
      ) : (
        <RankBadge rank={player.rank} />
      )}

      <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#e8c46a] bg-[#8b1a2b] text-sm font-bold text-[#e8c46a] shadow-[0_2px_5px_rgba(0,0,0,0.3)]">
        {player.name.trim() ? (
          initials(player.name)
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-bold leading-tight text-[#14213d] uppercase">
          {player.name}
        </p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-black text-[#14213d]">
          {player.points}
        </span>
        <span className="text-sm font-medium text-[#14213d]/70">pt</span>
      </div>
    </motion.li>
  )
}
