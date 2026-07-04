'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/fanta-cantine/giudice/Header'
import SearchCard from '@/components/fanta-cantine/giudice/SearchCard'
import BonusCatalog from '@/components/fanta-cantine/giudice/BonusCatalog'
import PendingProposals from '@/components/fanta-cantine/giudice/PendingProposals'
import HistoryCard from '@/components/fanta-cantine/giudice/HistoryCard'
import BottomNav from '@/components/fanta-cantine/giudice/BottomNav'
import { 
  getUtenti, 
  getBonusMalus, 
  getProposteInSospeso, 
  getStorico,
  creaProposta,
  confermaProposta,
  rifiutaProposta,
  type Utente,
  type BonusMalus,
  type Proposta
} from '@/lib/supabase/giudice-queries'

export default function AreaGiudice() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [utenti, setUtenti] = useState<Utente[]>([])
  const [bonusList, setBonusList] = useState<BonusMalus[]>([])
  const [pending, setPending] = useState<Proposta[]>([])
  const [history, setHistory] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(15 * 60)

  const supabase = createClient()

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  // Carica dati iniziali
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // 1. Prendi l'utente loggato
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Devi essere loggato')
        setLoading(false)
        return
      }
      setCurrentUserId(user.id)

      // 2. Verifica che sia un giudice
      const { data: utenteData } = await supabase
        .from('utenti')
        .select('ruolo')
        .eq('id', user.id)
        .single()

      if (utenteData?.ruolo !== 'giudice' && utenteData?.ruolo !== 'admin') {
        toast.error('Accesso negato: devi essere un giudice')
        setLoading(false)
        return
      }

      // 3. Carica tutti i dati
      const [utentiRes, bonusRes, pendingRes, historyRes] = await Promise.all([
        getUtenti(),
        getBonusMalus(),
        getProposteInSospeso(),
        getStorico(),
      ])

      setUtenti(utentiRes)
      setBonusList(bonusRes)
      setPending(pendingRes)
      setHistory(historyRes)
      setLoading(false)
    }

    loadData()
  }, [])

  const handlePropose = async (bonus: BonusMalus) => {
    if (!selectedUser) {
      toast.error('Seleziona prima un iscritto')
      return
    }
    if (!currentUserId) {
      toast.error('Utente non loggato')
      return
    }

    const result = await creaProposta(selectedUser, bonus.id, currentUserId)
    if (result.success) {
      toast.success(`✅ Proposta inviata: ${bonus.nome_evento}`)
      // Ricarica le proposte
      const newPending = await getProposteInSospeso()
      setPending(newPending)
      setSelectedUser(null)
    } else {
      toast.error(`❌ ${result.error}`)
    }
  }

  const handleConfirm = async (proposalId: string) => {
    if (!currentUserId) return
    const result = await confermaProposta(proposalId, currentUserId)
    if (result.success) {
      toast.success('✅ Proposta confermata!')
      const [newPending, newHistory] = await Promise.all([
        getProposteInSospeso(),
        getStorico(),
      ])
      setPending(newPending)
      setHistory(newHistory)
    } else {
      toast.error(`❌ ${result.error}`)
    }
  }

  const handleReject = async (proposalId: string) => {
    const result = await rifiutaProposta(proposalId)
    if (result.success) {
      toast.success('❌ Proposta rifiutata')
      const [newPending, newHistory] = await Promise.all([
        getProposteInSospeso(),
        getStorico(),
      ])
      setPending(newPending)
      setHistory(newHistory)
    } else {
      toast.error(`❌ ${result.error}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1530]">
        <div className="text-[#f5c94a] text-lg animate-pulse">⏳ Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Header onMenu={() => toast('📋 Menu')} />

      <div className="px-3 pt-4 flex flex-col gap-4 pb-24">
        <div className="fade-up">
          <SearchCard 
            users={utenti}
            selectedId={selectedUser} 
            onSelect={setSelectedUser} 
          />
        </div>
        <div className="fade-up">
          <BonusCatalog 
            bonusList={bonusList}
            onPropose={handlePropose} 
            selectedUser={selectedUser}
          />
        </div>
        <div className="fade-up">
          <PendingProposals 
            items={pending} 
            timer={`${mm}:${ss}`} 
            onConfirm={handleConfirm} 
            onReject={handleReject}
            currentUserId={currentUserId}
          />
        </div>
        <div className="fade-up">
          <HistoryCard items={history} />
        </div>
      </div>

      <BottomNav active="home" onChange={() => {}} />
    </div>
  )
}
