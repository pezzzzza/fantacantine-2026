'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Star } from 'lucide-react'
import { BonusGlyph } from './icons'
import { type BonusMalus } from '@/lib/supabase/giudice-queries'

interface BonusCatalogProps {
  bonusList: BonusMalus[]
  onPropose: (item: BonusMalus) => void
  selectedUser: string | null
}

const tabs = [
  { key: 'bonus', label: 'BONUS', color: 'green' },
  { key: 'malus', label: 'MALUS', color: 'red' },
  { key: 'bonus_speciale', label: 'SPECIALI', color: 'gold' },
]

export default function BonusCatalog({ bonusList, onPropose, selectedUser }: BonusCatalogProps) {
  const [tab, setTab] = useState('bonus')
  
  const filtered = bonusList.filter((b) => b.categoria === tab)
  const isMalus = tab === 'malus'

  const tabStyle = (t: typeof tabs[0]) => {
    const active = tab === t.key
    const map = {
      green: 'linear-gradient(180deg,#5c9636,#3c6522)',
      red: 'linear-gradient(180deg,#c33038,#921a21)',
      gold: 'linear-gradient(180deg,#f6ce55,#e0a11f)',
    }
    return {
      flex: 1,
      background: active ? map[t.color as keyof typeof map] : '#e4d5b0',
      color: active ? (t.color === 'gold' ? '#5e3a17' : '#fff') : '#8a6a3a',
      boxShadow: active ? '0 3px 0 rgba(0,0,0,0.25)' : 'none',
      opacity: active ? 1 : 0.9,
      padding: '9px 6px', fontSize: 13,
      borderRadius: 8,
    }
  }

  const getIconName = (nome: string): string => {
    const lower = nome.toLowerCase()
    if (lower.includes('danza') || lower.includes('balla')) return 'dance'
    if (lower.includes('canta') || lower.includes('musica')) return 'music'
    if (lower.includes('gruppo') || lower.includes('treno')) return 'group'
    if (lower.includes('vino') || lower.includes('beve') || lower.includes('brinda')) return 'wine'
    if (lower.includes('litiga') || lower.includes('arrabbiato')) return 'angry'
    if (lower.includes('personaggio') || lower.includes('resistente')) return 'star'
    return 'default'
  }

  return (
    <div className="parchment-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="card-badge">2</span>
        <h2 className="card-title text-lg">CATALOGO BONUS/MALUS</h2>
      </div>

      <div className="flex gap-2 mb-3">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="btn-3d flex items-center justify-center gap-1" style={tabStyle(t)}>
            {t.key === 'bonus_speciale' && <Star size={15} fill={tab === t.key ? '#5e3a17' : 'none'} />}
            <span>{t.label}</span>
            {t.key === 'bonus' && tab === 'bonus' && <CheckCircle2 size={16} />}
            {t.key === 'malus' && tab === 'malus' && <XCircle size={16} />}
          </button>
        ))}
      </div>

      <div className="flex flex-col max-h-80 overflow-y-auto">
        {filtered.length === 0 && (
          <div style={{ color: '#8a6a3a', textAlign: 'center', padding: 20, fontWeight: 500 }}>
            Nessun {tab === 'bonus' ? 'bonus' : tab === 'malus' ? 'malus' : 'bonus speciale'} disponibile
          </div>
        )}
        {filtered.map((b, i) => (
          <div key={b.id} className="flex items-center gap-3" style={{ padding: '10px 2px', borderTop: i === 0 ? 'none' : '1px dashed #d3c095' }}>
            <span className={`icon-circle ${isMalus ? 'icon-red' : 'icon-green'}`}>
              <BonusGlyph name={getIconName(b.nome_evento)} size={24} />
            </span>
            <div className="flex-1" style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#3a2410', fontSize: 16 }}>{b.nome_evento}</div>
              {b.descrizione && <div style={{ color: '#8a6a3a', fontSize: 13, fontWeight: 500 }}>{b.descrizione}</div>}
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: b.punti >= 0 ? '#3c6522' : '#a51f27', width: 54, textAlign: 'right' }}>
              {b.punti >= 0 ? '+' : ''}{b.punti} pt
            </div>
            <button 
              onClick={() => onPropose(b)} 
              className="btn-3d btn-yellow" 
              style={{ padding: '9px 14px', fontSize: 13, opacity: selectedUser ? 1 : 0.5 }}
              disabled={!selectedUser}
            >
              PROPONI
            </button>
          </div>
        ))}
      </div>
      {!selectedUser && (
        <div style={{ color: '#8a6a3a', textAlign: 'center', fontSize: 12, marginTop: 8 }}>
          💡 Seleziona prima un iscritto per proporre un bonus/malus
        </div>
      )}
    </div>
  )
}
