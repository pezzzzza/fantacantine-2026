'use client'

import React from 'react'
import { X, Target, User } from 'lucide-react'
import AvatarIniziali from './AvatarIniziali'
import { type Utente } from '@/lib/supabase/giudice-queries'

interface PlayerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  player: Utente | null
}

export default function PlayerDetailModal({ isOpen, onClose, player }: PlayerDetailModalProps) {
  if (!isOpen || !player) return null

  const stats = [
    { label: 'Punti totali', value: player.points },
    { label: 'Posizione', value: player.posizione || '-' },
    { label: 'Squadre', value: player.squadre },
    { label: 'Badge', value: player.badge },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full modal-pop"
        style={{
          maxWidth: 360,
          background: 'linear-gradient(180deg,#faf1d8 0%,#f3e6c4 100%)',
          border: '3px solid #8a5a2b', borderRadius: 20, padding: 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="chiudi"
          className="absolute flex items-center justify-center"
          style={{ right: 14, top: 14, width: 32, height: 32, borderRadius: 999, background: 'rgba(94,58,23,0.12)', color: '#5e3a17' }}
        >
          <X size={18} />
        </button>

        <div className="flex justify-center">
          <AvatarIniziali nome={player.nome} cognome={player.cognome} size="lg" />
        </div>

        <div className="mt-3 text-center">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#3a2410' }}>
            {player.nome} {player.cognome || ''}
          </h2>
          {player.soprannome && (
            <p style={{ fontSize: 14, color: '#8a6a3a', fontWeight: 500 }}>@{player.soprannome}</p>
          )}
        </div>

        <div className="mt-4">
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#a3894f', textTransform: 'uppercase' }}>
            ─── Statistiche ───
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {stats.map((st) => (
              <div key={st.label} style={{ borderRadius: 12, background: 'rgba(94,58,23,0.08)', padding: '10px 8px', textAlign: 'center', border: '1px solid #e0cfa6' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#3a2410' }}>{st.value}</p>
                <p style={{ fontSize: 11, color: '#8a6a3a' }}>{st.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#a3894f', textTransform: 'uppercase' }}>
            ─── Ruolo ───
          </p>
          <p className="mt-1 flex items-center justify-center gap-1" style={{ fontSize: 15, color: '#3a2410', fontWeight: 600 }}>
            <User size={16} /> {player.ruolo === 'giudice' ? 'Giudice' : 'Giocatore'}
          </p>
        </div>

        <button
          className="btn-3d btn-yellow mt-5 w-full flex items-center justify-center gap-2"
          style={{ padding: '13px', fontSize: 15 }}
          onClick={onClose}
        >
          <Target size={18} /> CHIUDI
        </button>
      </div>
    </div>
  )
}
