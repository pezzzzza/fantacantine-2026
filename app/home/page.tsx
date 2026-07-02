'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface Utente {
  id: string
  nome: string
  soprannome?: string
  ruolo: string
  created_at: string
}

interface Evento {
  id: string
  nome: string
  data: string
  descrizione: string
  immagine_url: string
  serata: number
}

// Determina la serata corrente in base alla data di oggi
const getSerataCorrente = (): number => {
  const oggi = new Date()
  const mese = oggi.getMonth()
  const giorno = oggi.getDate()
  
  // Agosto 2026
  if (mese === 7) { // Agosto è mese 7 (0-based)
    if (giorno === 19) return 1
    if (giorno === 20) return 2
    if (giorno === 21) return 3
    if (giorno === 22) return 4
  }
  
  // Prima del 19 Agosto -> mostra serata 1 (prossima)
  if (mese < 7 || (mese === 7 && giorno < 19)) return 1
  
  // Dopo il 22 Agosto -> mostra serata 4 (ultima)
  return 4
}

export default function HomePage() {
  const [utente, setUtente] = useState<Utente | null>(null)
  const [stato, setStato] = useState<StatoPresenza>(null)
  const [classifica, setClassifica] = useState<any[]>([])
  const [missioni, setMissioni] = useState<any[]>([])
  const [missioniCompletate, setMissioniCompletate] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [puntiTotali, setPuntiTotali] = useState(0)
  const [posizione, setPosizione] = useState<number | null>(null)
  const [badgeSbloccati, setBadgeSbloccati] = useState<any[]>([])
  const [squadraCount, setSquadraCount] = useState(0)
  const [presenzeCount, setPresenzeCount] = useState(0)
  const [prossimoEvento, setProssimoEvento] = useState<Evento | null>(null)
  const [serataCorrente, setSerataCorrente] = useState(1)
  const [timer, setTimer] = useState({ ore: 0, minuti: 0, secondi: 0 })

  const supabase = createClient()
  const router = useRouter()

  // Timer reale (scade alle 18:00)
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
    
    // 1. Verifica utente loggato
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      setLoading(false)
      return
    }

    // 2. Determina serata corrente
    const serata = getSerataCorrente()
    setSerataCorrente(serata)

    // 3. Carica profilo utente
    const { data: utenteData } = await supabase
      .from('utenti')
      .select('*')
      .eq('id', user.id)
      .single()
    setUtente(utenteData)

    // 4. Carica presenza per la serata corrente
    const { data: presenzaData } = await supabase
      .from('presenze')
      .select('stato')
      .eq('utente_id', user.id)
      .eq('serata', serata)
      .single()
    if (presenzaData) setStato(presenzaData.stato)

    // 5. Carica classifica giocatori (top 5)
    const { data: classificaData } = await supabase
      .from('classifica_giocatori')
      .select('*')
      .order('punti_totali', { ascending: false })
      .limit(5)
    setClassifica(classificaData || [])

    // 6. Carica punti utente
    const { data: puntiData } = await supabase
      .from('classifica_giocatori')
      .select('punti_totali')
      .eq('id', user.id)
      .single()
    if (puntiData) setPuntiTotali(puntiData.punti_totali || 0)

    // 7. Calcola posizione in classifica
    const { data: classificaCompleta } = await supabase
      .from('classifica_giocatori')
      .select('id')
      .order('punti_totali', { ascending: false })
    if (classificaCompleta) {
      const index = classificaCompleta.findIndex((c: any) => c.id === user.id)
      setPosizione(index !== -1 ? index + 1 : null)
    }

    // 8. Carica missioni per la serata corrente
    const { data: missioniData } = await supabase
      .from('missioni')
      .select('*')
      .eq('serata', serata)
      .eq('attiva', true)
    setMissioni(missioniData || [])

    // 9. Carica missioni completate per la serata corrente
    const { data: completateData } = await supabase
      .from('completamenti_missioni')
      .select('missione_id')
      .eq('giocatore_id', user.id)
      .eq('serata', serata)
    if (completateData) {
      setMissioniCompletate(completateData.map((c: any) => c.missione_id))
    }

    // 10. Carica badge (se esiste la tabella)
    try {
      const { data: badgeData } = await supabase
        .from('badge_assegnati')
        .select('badge_id, badge (nome, icona, descrizione)')
        .eq('utente_id', user.id)
      if (badgeData) {
        setBadgeSbloccati(badgeData.map((b: any) => b.badge))
      }
    } catch (e) {
      setBadgeSbloccati([])
    }

    // 11. Conta squadre dell'utente (come membro)
    const { data: roseData } = await supabase
      .from('squadra_membri')
      .select('squadra_id')
      .eq('utente_id', user.id)
    setSquadraCount(roseData?.length || 0)

    // 12. Conta presenze totali per la serata corrente
    const { count } = await supabase
      .from('presenze')
      .select('*', { count: 'exact', head: true })
      .eq('serata', serata)
      .eq('stato', 'ci_saro')
    setPresenzeCount(count || 0)

    // 13. Carica evento per la serata corrente
    const { data: eventoData, error: eventoError } = await supabase
      .from('eventi')
      .select('*')
      .eq('serata', serata)
      .single()

    if (eventoError) {
      console.error('Errore caricamento evento:', eventoError)
      setProssimoEvento(null)
    } else {
      setProssimoEvento(eventoData)
    }

    setLoading(false)
  }

  const handlePresenza = async (nuovoStato: StatoPresenza) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || nuovoStato === stato) return
    
    const { error } = await supabase
      .from('presenze')
      .upsert({
        utente_id: user.id,
        serata: serataCorrente,
        stato: nuovoStato,
        updated_at: new Date()
      }, { onConflict: 'utente_id, serata' })
    
    if (!error) {
      setStato(nuovoStato)
      loadData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bordeaux-deep">
        <div className="animate-pulse text-gold text-sm">⏳ Caricamento...</div>
      </div>
    )
  }

  const displayName = utente?.soprannome || utente?.nome || 'Bomba'
  
  const dataIscrizione = utente?.created_at 
    ? new Date(utente.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long' })
    : '2026'

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
              dataIscrizione={dataIscrizione}
            />
          </div>

          <PresenceSelector 
            stato={stato}
            onPresenza={handlePresenza}
            presenzeCount={presenzeCount}
            serata={serataCorrente}
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
              serata={serataCorrente}
            />
            <NextEventCard evento={prossimoEvento} />
          </div>

          <TopPlayers classifica={classifica} />
        </div>

        <BottomNav />
      </div>
    </main>
  )
}
