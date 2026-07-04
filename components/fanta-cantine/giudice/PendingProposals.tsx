'use client'

import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { BonusGlyph } from './icons'
import AvatarIniziali from './AvatarIniziali'
import { type Proposta } from '@/lib/supabase/giudice-queries'

interface PendingProposalsProps {
  items: Proposta[]
  timer: string
  onConfirm: (id: string) => void
  onReject: (id: string) => void
  currentUserId: string | null
}

export default function PendingProposals({ 
  items, 
  timer, 
  onConfirm, 
  onReject,
  currentUserId 
}: PendingProposalsProps) {
  const getIconName = (nome: string): string => {
    const lower = nome.toLowerCase()
    if (lower.includes('danza') || lower.includes('balla')) return 'dance'
    if (lower.includes('canta') || lower.includes('musica')) return 'music'
    if (lower.includes('gruppo') || lower.includes('treno')) return 'group'
    if (lower.includes('vino') || lower.includes('beve') || lower.includes('brinda')) return 'wine'
    if (lower.includes('litiga') || lower.includes('arrabbiato')) return 'angry'
    return 'default'
  }

  return (
    <div className="parchment-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="card-badge">3</span>
        <h2 className="card-title text-lg flex-1">PROPOSTE IN SOSPESO</h2>
        <span style={{ color: '#6e4a1e', fontSize: 14, fontWeight: 600 }}>Scade tra <b style={{ color: '#a51f27' }}>{timer}</b></span>
      </div>

      <div className="flex flex-col max-h-72 overflow-y-auto">
        {items.length === 0 && (
          <div style={{ color: '#8a6a3a', textAlign: 'center', padding: 20, fontWeight: 500 }}>
            Nessuna proposta in sospeso
          </div>
        )}
        {items.map((p, i) => {
          const canAct = currentUserId && p.proposto_da !== currentUserId
          return (
            <div key={p.id} className="flex items-center gap-2 flex-wrap" style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px dashed #d3c095' }}>
              <AvatarIniziali nome={p.utente_nome || '?'} cognome={p.utente_cognome} size="sm" />
              <div style={{ width: 100 }}>
                <div style={{ fontWeight: 700, color: '#3a2410', fontSize: 16 }}>
                  {p.utente_nome} {p.utente_cognome || ''}
                </div>
                <div style={{ color: '#8a6a3a', fontSize: 12, fontWeight: 500 }}>Proposto da: {p.proposto_da_nome}</div>
              </div>
              <span className="icon-circle icon-green" style={{ width: 40, height: 40 }}>
                <BonusGlyph name={getIconName(p.bonus_nome || '')} size={20} />
              </span>
              <div className="flex-1" style={{ minWidth: 90 }}>
                <div style={{ fontWeight: 700, color: '#3a2410', fontSize: 15 }}>{p.bonus_nome}</div>
                <div style={{ color: '#3c6522', fontWeight: 700, fontSize: 14 }}>+{p.bonus_punti} pt</div>
              </div>
              <div className="flex gap-2 ml-auto">
                {canAct ? (
                  <>
                    <button onClick={() => onConfirm(p.id)} className="btn-3d btn-green flex items-center gap-1" style={{ padding: '8px 12px', fontSize: 13 }}>
                      <CheckCircle2 size={16} /> CONFERMA
                    </button>
                    <button onClick={() => onReject(p.id)} className="btn-3d btn-red flex items-center gap-1" style={{ padding: '8px 12px', fontSize: 13 }}>
                      <XCircle size={16} /> RIFIUTA
                    </button>
                  </>
                ) : (
                  <span style={{ color: '#8a6a3a', fontSize: 12, fontStyle: 'italic' }}>In attesa di altri giudici</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
