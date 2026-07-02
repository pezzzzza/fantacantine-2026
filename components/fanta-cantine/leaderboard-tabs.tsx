'use client'

import { motion } from 'framer-motion'
import { Trophy, User } from 'lucide-react'

export type TabKey = 'squadre' | 'giocatori'

const TABS: { key: TabKey; label: string; Icon: typeof Trophy }[] = [
  { key: 'squadre', label: 'Squadre', Icon: Trophy },
  { key: 'giocatori', label: 'Giocatori', Icon: User },
]

export function LeaderboardTabs({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (key: TabKey) => void
}) {
  return (
    <div
      className="mx-4 mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/30 bg-night-soft/60"
      role="tablist"
      aria-label="Tipo di classifica"
    >
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className="relative flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <Icon
              className={`h-5 w-5 transition-colors ${isActive ? 'text-gold' : 'text-parchment/50'}`}
            />
            <span className={isActive ? 'text-gold' : 'text-parchment/50'}>
              {label}
            </span>
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-gold shadow-[0_0_6px_rgba(232,196,106,0.8)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
