'use client'

import React from 'react'
import { Music, Users, Wine, Star, Angry, PersonStanding } from 'lucide-react'

interface BonusGlyphProps {
  name: string
  size?: number
  color?: string
}

export function BonusGlyph({ name, size = 24, color = '#fff' }: BonusGlyphProps) {
  const common = { size, color, strokeWidth: 2.2 }

  switch (name) {
    case 'dance':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="4" r="1.6" />
          <path d="M7 6 l-1 5 l-2 4 M7 6 l2 4 l-1 5 M6 11 l3 0" />
          <circle cx="17" cy="4" r="1.6" />
          <path d="M17 6 l1 5 l2 4 M17 6 l-2 4 l1 5 M15 11 l3 0" />
        </svg>
      )
    case 'music':
      return <Music {...common} />
    case 'group':
      return <Users {...common} />
    case 'wine':
      return <Wine {...common} />
    case 'star':
      return <Star {...common} fill={color} />
    case 'angry':
      return <Angry {...common} />
    default:
      return <PersonStanding {...common} />
  }
}
