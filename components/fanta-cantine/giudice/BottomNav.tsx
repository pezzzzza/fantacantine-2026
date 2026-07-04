'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Home, Trophy, Users, User, Wine } from 'lucide-react'

interface BottomNavProps {
  active?: string
  onChange?: (key: string) => void
}

const items = [
  { key: 'home', label: 'HOME', icon: Home, path: '/home' },
  { key: 'classifiche', label: 'CLASSIFICHE', icon: Trophy, path: '/classifica' },
  { key: 'calice', label: '', icon: Wine, center: true, path: '/home' },
  { key: 'squadra', label: 'SQUADRA', icon: Users, path: '/squadra' },
  { key: 'profilo', label: 'PROFILO', icon: User, path: '/profilo' },
]

export default function BottomNav({ active = 'home', onChange }: BottomNavProps) {
  const router = useRouter()

  const handleClick = (item: typeof items[0]) => {
    if (onChange) onChange(item.key)
    if (item.path) router.push(item.path)
  }

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50"
      style={{ transform: 'translateX(-50%)', width: '100%', maxWidth: 480 }}
    >
      <div style={{
        background: 'linear-gradient(180deg,#7c1720,#5a0f16)',
        borderTop: '2px solid #3a0a0f',
        boxShadow: '0 -4px 14px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        height: 74, paddingBottom: 8,
      }}>
        {items.map((it) => {
          const Icon = it.icon
          if (it.center) {
            return (
              <button key={it.key} onClick={() => handleClick(it)}
                className="relative flex flex-col items-center" style={{ width: 70 }}>
                <span style={{
                  position: 'absolute', bottom: 12,
                  width: 66, height: 66, borderRadius: 999,
                  background: 'radial-gradient(circle at 40% 35%, #f6ce55, #e0a11f)',
                  border: '4px solid #7c1720',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Wine size={30} color="#6e1420" strokeWidth={2.4} />
                </span>
              </button>
            )
          }
          const isActive = active === it.key
          return (
            <button key={it.key} onClick={() => handleClick(it)}
              className="flex flex-col items-center gap-1" style={{ width: 72, opacity: isActive ? 1 : 0.82 }}>
              <Icon size={24} color={isActive ? '#f6c445' : '#f0ddc4'} strokeWidth={2.2} />
              <span style={{ color: isActive ? '#f6c445' : '#f0ddc4', fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
