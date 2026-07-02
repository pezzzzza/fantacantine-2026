'use client'

import { motion } from 'framer-motion'
import { Home, Trophy, Wine, Users, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ITEMS = [
  { key: 'home', label: 'Home', Icon: Home, path: '/home' },
  { key: 'classifiche', label: 'Classifiche', Icon: Trophy, path: '/classifica' },
  { key: 'squadra', label: 'Squadra', Icon: Users, path: '/squadra' },
  { key: 'profilo', label: 'Profilo', Icon: User, path: '/profilo' },
]

export function LeaderboardBottomNav() {
  const router = useRouter()

  return (
    <nav className="relative flex items-end justify-between rounded-t-3xl border-t border-[#e8c46a]/25 bg-[#8b1a2b] px-6 pb-3 pt-3">
      {ITEMS.slice(0, 2).map(({ key, label, Icon, path }) => (
        <NavItem 
          key={key} 
          label={label} 
          Icon={Icon} 
          active={key === 'classifiche'} 
          onClick={() => router.push(path)}
        />
      ))}

      {/* center wine glass */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/home')}
        className="-mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-[#8b1a2b] bg-[#e8c46a] text-[#14213d] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        aria-label="Menu principale"
      >
        <Wine className="h-7 w-7" fill="#14213d" />
      </motion.button>

      {ITEMS.slice(2).map(({ key, label, Icon, path }) => (
        <NavItem 
          key={key} 
          label={label} 
          Icon={Icon} 
          active={false}
          onClick={() => router.push(path)}
        />
      ))}
    </nav>
  )
}

function NavItem({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string
  Icon: typeof Home
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1"
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-[#e8c46a]' : 'text-[#f5efe6]/70'}`} />
      <span
        className={`text-[10px] font-semibold uppercase tracking-wide ${active ? 'text-[#e8c46a]' : 'text-[#f5efe6]/70'}`}
      >
        {label}
      </span>
    </button>
  )
}
