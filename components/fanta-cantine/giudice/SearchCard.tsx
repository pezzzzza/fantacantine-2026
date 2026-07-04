'use client'

import React, { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import AvatarIniziali from './AvatarIniziali'
import PlayerDetailModal from './PlayerDetailModal'
import { type Utente } from '@/lib/supabase/giudice-queries'

interface SearchCardProps {
  users: Utente[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function SearchCard({ users, selectedId, onSelect }: SearchCardProps) {
  const [q, setQ] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<Utente | null>(null)
  
  const filtered = users.filter((u) => 
    u.nome.toLowerCase().includes(q.toLowerCase()) ||
    (u.cognome && u.cognome.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <div className="parchment-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="card-badge">1</span>
        <h2 className="card-title text-lg">RICERCA ISCRITTO</h2>
      </div>

      <div className="relative mb-3">
        <Search size={20} color="#a08a5e" className="absolute" style={{ left: 14, top: 13 }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca iscritto..."
          className="w-full outline-none"
          style={{ padding: '12px 12px 12px 44px', borderRadius: 12, border: '2px solid #d8c6a0', background: '#fdf7e8', color: '#5e3a17', fontSize: 15, fontWeight: 500 }}
        />
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {filtered.map((u) => {
          const active = selectedId === u.id
          return (
            <button
              key={u.id}
              onClick={() => {
                onSelect(u.id)
                setSelectedPlayer(u)
              }}
              className="btn-3d flex items-center gap-3 text-left w-full"
              style={{
                padding: '8px 12px', borderRadius: 14,
                background: active ? 'linear-gradient(180deg,#f9d24e,#f2b829)' : '#f1e6c8',
                border: active ? '2px solid #d69a1e' : '2px solid #ddceaa',
                boxShadow: active ? '0 3px 0 #cf9317' : 'none',
              }}
            >
              <AvatarIniziali nome={u.nome} cognome={u.cognome} size="md" />
              <div className="flex-1 text-left">
                <div style={{ fontWeight: 700, color: '#3a2410', fontSize: 17 }}>
                  {u.nome} {u.cognome || ''}
                </div>
                <div style={{ color: '#7a5a2e', fontSize: 14, fontWeight: 500 }}>{u.points} pt</div>
              </div>
              <ChevronRight size={22} color="#6e4a1e" />
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ color: '#8a6a3a', textAlign: 'center', padding: 12, fontWeight: 500 }}>Nessun iscritto trovato</div>
        )}
      </div>

      <PlayerDetailModal
        isOpen={!!selectedPlayer}
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  )
}
