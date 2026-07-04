'use client'

import React from 'react'
import { Menu, Bell, Scale } from 'lucide-react'

interface HeaderProps {
  onMenu?: () => void
}

const BG = 'https://images.unsplash.com/photo-1772864464263-69fe545ff049?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxpdGFsaWFuJTIwZmVzdGl2YWwlMjBuaWdodHxlbnwwfHx8fDE3ODMxNjA0MzR8MA&ixlib=rb-4.1.0&q=85'

export default function Header({ onMenu }: HeaderProps) {
  return (
    <header className="relative w-full overflow-hidden" style={{ height: 260 }}>
      {/* Festival background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8,16,40,0.35) 0%, rgba(8,16,40,0.55) 60%, rgba(8,16,40,0.85) 100%), url(${BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* String lights */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-1" style={{ marginTop: 6 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} style={{ position: 'relative', top: `${Math.abs(Math.sin(i)) * 10 + (i % 2 === 0 ? 0 : 6)}px` }}>
            <span style={{
              display: 'block', width: 8, height: 8, borderRadius: '50%',
              background: '#ffdf7e', boxShadow: '0 0 8px 3px rgba(255,205,90,0.85)'
            }} />
          </span>
        ))}
      </div>

      {/* Top controls */}
      <button
        onClick={onMenu}
        aria-label="menu"
        className="absolute z-20 flex items-center justify-center"
        style={{ top: 16, left: 16, width: 52, height: 40, borderRadius: 999, background: 'rgba(20,25,45,0.72)', border: '1px solid rgba(255,255,255,0.25)' }}
      >
        <Menu size={24} color="#f6ecd3" />
      </button>

      <button
        aria-label="notifiche"
        className="absolute z-20 flex items-center justify-center"
        style={{ top: 16, right: 16, width: 44, height: 40, borderRadius: 999, background: 'rgba(20,25,45,0.72)', border: '1px solid rgba(255,255,255,0.25)' }}
      >
        <Bell size={22} color="#f6ecd3" />
        <span className="absolute" style={{ top: -4, right: -4, background: '#b5232b', color: '#fff', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1530' }}>3</span>
      </button>

      {/* Logo cluster */}
      <div className="absolute z-10 w-full flex flex-col items-center" style={{ top: 60 }}>
        <Scale size={26} color="#f5c94a" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.6))', marginBottom: -2 }} />
        <div className="flex items-center gap-2">
          {/* Wine glass */}
          <svg width="40" height="58" viewBox="0 0 40 58" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}>
            <path d="M6 4 h28 a4 4 0 0 1 4 4 c0 12 -8 20 -18 20 S2 20 2 8 A4 4 0 0 1 6 4 z" fill="#7a1220" stroke="#e2c9a0" strokeWidth="2" />
            <path d="M20 28 v18" stroke="#e2c9a0" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 52 h24" stroke="#e2c9a0" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <div className="flex flex-col items-center" style={{ lineHeight: 0.86 }}>
            <span className="font-logo" style={{ fontSize: 40, fontWeight: 900, color: '#f5c94a', textShadow: '0 2px 0 #7a4a12, 0 3px 6px rgba(0,0,0,0.7)', letterSpacing: 1 }}>AREA</span>
            <span className="font-logo" style={{ fontSize: 46, fontWeight: 900, color: '#f5c94a', textShadow: '0 2px 0 #7a4a12, 0 3px 6px rgba(0,0,0,0.7)', letterSpacing: 1 }}>GIUDICE</span>
          </div>

          {/* Shield */}
          <svg width="42" height="56" viewBox="0 0 42 56" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))' }}>
            <path d="M21 2 L40 8 V28 C40 42 32 50 21 54 C10 50 2 42 2 28 V8 Z" fill="#6e1420" stroke="#e2a72e" strokeWidth="2.5" />
            <path d="M12 8 h18 l-2 5 h-14 z" fill="#e2a72e" opacity="0.9" />
            <circle cx="21" cy="30" r="4" fill="#8a2230" />
            <circle cx="15" cy="36" r="4" fill="#8a2230" />
            <circle cx="27" cy="36" r="4" fill="#8a2230" />
            <circle cx="21" cy="40" r="4" fill="#8a2230" />
          </svg>
        </div>
      </div>

      {/* Red banner */}
      <div className="absolute z-10 w-full flex justify-center" style={{ bottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(180deg,#a71e26,#7c1319)',
            color: '#f6ecd3', fontWeight: 600, fontSize: 15,
            padding: '8px 26px', borderRadius: 6,
            boxShadow: '0 3px 6px rgba(0,0,0,0.5)', fontStyle: 'italic'
          }}>
            Assegna bonus e malus agli iscritti
          </div>
          <span style={ribbon('left')} />
          <span style={ribbon('right')} />
        </div>
      </div>
    </header>
  )
}

function ribbon(side: 'left' | 'right') {
  return {
    position: 'absolute', top: '50%', [side]: -12, transform: 'translateY(-50%)',
    width: 0, height: 0,
    borderTop: '17px solid transparent', borderBottom: '17px solid transparent',
    [side === 'left' ? 'borderRight' : 'borderLeft']: '13px solid #5e0f14',
  }
}
