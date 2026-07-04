'use client'

import React from 'react'

interface AvatarInizialiProps {
  nome: string
  cognome?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarIniziali({ nome, cognome, size = 'md' }: AvatarInizialiProps) {
  const inizialeNome = nome ? nome.charAt(0).toUpperCase() : ''
  const inizialeCognome = cognome ? cognome.charAt(0).toUpperCase() : ''
  const iniziali = (inizialeNome + inizialeCognome) || '?'

  const sizes = {
    sm: { box: 40, font: 15 },
    md: { box: 46, font: 17 },
    lg: { box: 72, font: 28 },
  }

  const colors = ['#b5232b', '#8a2230', '#3c6522', '#5c9636', '#c47a1a', '#e0a11f', '#7a4a12', '#a3591f', '#6e1420', '#4a7c2b', '#b9821f', '#8a5a2b']
  const idx = (nome ? nome.length : 0) % colors.length
  const bg = colors[idx]
  const s = sizes[size] || sizes.md

  return (
    <div
      className="flex items-center justify-center select-none flex-shrink-0"
      style={{
        width: s.box, height: s.box, borderRadius: 999,
        background: bg, color: '#fff', fontWeight: 700, fontSize: s.font,
        boxShadow: '0 3px 6px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.6)',
        fontFamily: 'Fredoka, sans-serif', letterSpacing: 0.5,
      }}
    >
      {iniziali}
    </div>
  )
}
