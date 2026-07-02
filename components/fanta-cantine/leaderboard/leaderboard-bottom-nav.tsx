'use client'

import { motion } from 'framer-motion'
import { Home, Trophy, Wine, Users, User } from 'lucide-react'

const ITEMS = [
  { key: 'home', label: 'Home', Icon: Home },
  { key: 'classifiche', label: 'Classifiche', Icon: Trophy, active: true },
  { key: 'squadra', label: 'Squadra', Icon: Users },
  { key: 'profilo', label: 'Profilo', Icon: User },
]

export function LeaderboardBottomNav() {
  return (
    <nav className="relative flex items-end justify-between rounded-t-3xl border-t border-gold/25 bg-wine-deep px-6 pb-3 pt-3">
      {ITEMS.slice(0, 2).map(({ key, label, Icon, active }) => (
        <NavItem key={key} label={label} Icon={Icon} active={active} />
      ))}

      {/* center wine glass */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        className="-mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-wine-deep bg-gold text-night-deep shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        aria-label="Menu principale"
      >
        <Wine className="h-7 w-7" fill="#14213d" />
      </motion.button>

      {ITEMS.slice(2).map(({ key, label, Icon, active }) => (
        <NavItem key={key} label={label} Icon={Icon} active={active} />
      ))}
    </nav>
  )
}

function NavItem({
  label,
  Icon,
  active,
}: {
  label: string
  Icon: typeof Home
  active?: boolean
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1"
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-gold' : 'text-parchment/70'}`} />
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${active ? 'text-gold' : 'text-parchment/70'}`}
      >
        {label}
      </span>
    </button>
  )
}
