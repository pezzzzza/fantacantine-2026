'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeroBanner } from "@/components/fanta-cantine/hero-banner"
import { ProfileCard } from "@/components/fanta-cantine/profile-card"
import { PresenceSelector } from "@/components/fanta-cantine/presence-selector"
import { FormationCard } from "@/components/fanta-cantine/formation-card"
import { MissionsCard } from "@/components/fanta-cantine/missions-card"
import { NextEventCard } from "@/components/fanta-cantine/next-event-card"
import { TopPlayers } from "@/components/fanta-cantine/top-players"
import { BottomNav } from "@/components/fanta-cantine/bottom-nav"

type StatoPresenza = 'ci_saro' | 'forse' | 'non_ci_saro' | null

export default function HomePage() {
  const [utente, setUtente] = useState<any>(null)
  const [stato, setStato] = useState<StatoPresenza>(null)
  const [classifica, setClassifica] = useState<any[]>([])
  const [missioni, setMissioni] = useState<any[]>([])
  const [missioniCompletate, setMissioniCompletate] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [puntiTotali, setPuntiTotali] = useState(0)
  const [posizione, setPosizione] = useState<number | null>(null)
  const [badgeSbloccati, setBadgeSbloccati] = useState<any[]>([])
  const [timer, setTimer] = useState({ ore: 0, minuti: 0, secondi: 0 })
  const [squadraCount, setSquadraCount] = useState(0)
  const supabase = createClient()

  // Timer reale
  useEffect(() => {
    const calcolaTimer = () => {
      const ora = new Date()
      const target = new Date(ora)
      target.setHours(18, 0, 0, 0)
      if (ora > target) target.setDate(target.getDate() + 1)
      const diff = Math.max(0, Math.floor((target.getTime() - ora.getTime()) / 1000))
      setTimer({
        ore: Math.floor(diff / 3600),
        minuti: Math.floor((diff % 3600) / 60),
        secondi: diff % 60
      })
    }
    calcolaTimer()
    const interval = setInterval(calcolaTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: utenteData } = await supabase
      .from('utenti')
      .select('*')
      .eq('id', user.id)
      .single()
    setUtente(utenteData)

    const { data: presenzaData } = await supabase
      .from('presenze')
      .select('stato')
      .eq('utente_id', user.id)
      .eq('serata', 1)
      .single()
    if (presenzaData) setStato(presenzaData.stato)

    const { data: classificaData } = await supabase
      .from('classifica_giocatori')
      .select('*')
      .order('punti_totali', { ascending: false })
      .limit(5)
    setClassifica(classificaData || [])

    const { data: puntiData } = await supabase
      .from('classifica_giocatori')
      .select('punti_totali')
      .eq('id', user.id)
      .single()
    if (puntiData) setPuntiTotali(puntiData.punti_totali || 0)

    const { data: classificaCompleta } = await supabase
      .from('classifica_giocatori')
      .select('id')
      .order('punti_totali', { ascending: false })
    if (classificaCompleta) {
      const index = classificaCompleta.findIndex((c: any) => c.id === user.id)
      setPosizione(index !== -1 ? index + 1 : null)
    }

    const { data: missioniData } = await supabase
      .from('missioni')
      .select('*')
      .eq('serata', 1)
      .eq('attiva', true)
    setMissioni(missioniData || [])

    const { data: completateData } = await supabase
      .from('completamenti_missioni')
      .select('missione_id')
      .eq('giocatore_id', user.id)
      .eq('serata', 1)
    if (completateData) {
      setMissioniCompletate(completateData.map((c: any) => c.missione_id))
    }

    const { data: badgeData } = await supabase
      .from('badge_assegnati')
      .select('badge_id, badge (nome, icona, descrizione)')
      .eq('utente_id', user.id)
    if (badgeData) {
      setBadgeSbloccati(badgeData.map((b: any) => b.badge))
    }

    const { data: roseData } = await supabase
      .from('rose')
      .select('squadra_id')
      .eq('giocatore_id', user.id)
      .eq('serata', 1)
    setSquadraCount(roseData?.length || 0)

    setLoading(false)
  }

  const handlePresenza = async (nuovoStato: StatoPresenza) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || nuovoStato === stato) return
    const { error } = await supabase
      .from('presenze')
      .upsert({
        utente_id: user.id,
        serata: 1,
        stato: nuovoStato,
        updated_at: new Date()
      }, { onConflict: 'utente_id, serata' })
    if (!error) {
      setStato(nuovoStato)
      loadData()
    }
  }

  const displayName = utente?.soprannome || utente?.nome || 'Bomba'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bordeaux-deep">
        <div className="animate-pulse text-gold text-sm">⏳ Caricamento...</div>
      </div>
    )
  }

  return (
    <main className="min-h-dvh bg-bordeaux-deep">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-bordeaux-deep">
        <HeroBanner />

        <div className="flex flex-1 flex-col gap-5 px-4 pb-2 pt-4">
          <div className="relative z-10 -mt-10">
            <ProfileCard 
              nome={utente?.nome || 'Bomba'}
              soprannome={utente?.soprannome}
              puntiTotali={puntiTotali}
              posizione={posizione}
              badgeCount={badgeSbloccati.length}
              squadreCount={squadraCount}
            />
          </div>

          <PresenceSelector 
            stato={stato}
            onPresenza={handlePresenza}
            presenzeCount={0}
          />

          <FormationCard 
            ore={timer.ore}
            minuti={timer.minuti}
            secondi={timer.secondi}
          />

          <div className="grid grid-cols-2 gap-4">
            <MissionsCard 
              missioni={missioni}
              completate={missioniCompletate}
            />
            <NextEventCard />
          </div>

          <TopPlayers classifica={classifica} />
        </div>

        <BottomNav />
      </div>
    </main>
  )
}