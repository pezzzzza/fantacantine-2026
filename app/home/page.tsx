'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PageTransition } from '@/components/ui/PageTransition'
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

// Mappa delle date delle serate
const DATE_SERATE: Record<number, { mese: number, giorno: number }> = {
  1: { mese: 7, giorno: 19 },
  2: { mese: 7, giorno: 20 },
  3: { mese: 7, giorno: 21 },
  4: { mese: 7, giorno: 22 },
}

const getSerataCorrente = (): number => {
  const oggi = new Date()
  const mese = oggi.getMonth()
  const giorno = oggi.getDate()
  
  if (mese === 7) {
    if (giorno === 19) return 1
    if (giorno === 20) return 2
    if (giorno === 21) return 3
    if (giorno === 22) return 4
  }
  
  if (mese < 7 || (mese === 7 && giorno < 19)) return 1
  if (mese === 7 && giorno > 22) return 0
  if (mese > 7) return 0
  
  return 1
}

const getSerataFromDate = (date: Date): number => {
  const mese = date.getMonth()
  const giorno = date.getDate()
  
  if (mese === 7) {
    if (giorno === 19) return 1
    if (giorno === 20) return 2
    if (giorno === 21) return 3
    if (giorno === 22) return 4
    if (giorno > 22) return 0
  }
  if (mese > 7) return 0
  return 1
}

const getProssimaScadenza = (): Date | null => {
  const oggi = new Date()
  const serata = getSerataCorrente()
  
  if (serata === 0) return null
  
  const serataInfo = DATE_SERATE[serata]
  if (!serataInfo) return null
  
  const target = new Date(2026, serataInfo.mese, serataInfo.giorno, 18, 0, 0, 0)
  
  const oggiData = new Date(oggi)
  oggiData.setHours(0, 0, 0, 0)
  
  const targetData = new Date(target)
  targetData.setHours(0, 0, 0, 0)
  
  if (oggiData.getTime() === targetData.getTime()) {
    const scadenza = new Date(oggi)
    scadenza.setHours(18, 0, 0, 0)
    
    if (oggi > scadenza) {
      const prossimoGiorno = new Date(target)
      prossimoGiorno.setDate(prossimoGiorno.getDate() + 1)
      const prossimaSerata = getSerataFromDate(prossimoGiorno)
      if (prossimaSerata === 0) return null
      prossimoGiorno.setHours(18, 0, 0, 0)
      return prossimoGiorno
    }
    return scadenza
  }
  
  if (oggi < target) {
    return target
  }
  
  const prossimoGiorno = new Date(target)
  prossimoGiorno.setDate(prossimoGiorno.getDate() + 1)
  const prossimaSerata = getSerataFromDate(prossimoGiorno)
  if (prossimaSerata === 0) return null
  prossimoGiorno.setHours(18, 0, 0, 0)
  return prossimoGiorno
}

// Chiave per sessionStorage
const CACHE_KEY = 'fantacantine_dashboard_cache'
const CACHE_TIMESTAMP_KEY = 'fantacantine_dashboard_timestamp'

export default function DashboardPage() {
  // Stati
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
  const [festaFinita, setFestaFinita] = useState(false)
  const [timer, setTimer] = useState({ ore: 0, minuti: 0, secondi: 0 })
  const [notifiche, setNotifiche] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  // Timer
  useEffect(() => {
    const calcolaTimer = () => {
      const prossimaScadenza = getProssimaScadenza()
      if (!prossimaScadenza) {
        setFestaFinita(true)
        return { ore: 0, minuti: 0, secondi: 0 }
      }
      const ora = new Date()
      const diff = Math.max(0, Math.floor((prossimaScadenza.getTime() - ora.getTime()) / 1000))
      setFestaFinita(false)
      return {
        ore: Math.floor(diff / 3600),
        minuti: Math.floor((diff % 3600) / 60),
        secondi: diff % 60
      }
    }
    const aggiornaTimer = () => {
      const result = calcolaTimer()
      setTimer(result)
    }
    aggiornaTimer()
    const interval = setInterval(aggiornaTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  // Caricamento dati
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // 1. Prova a leggere la cache da sessionStorage
    const cachedData = sessionStorage.getItem(CACHE_KEY)
    const cachedTimestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY)
    
    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10)
      const now = Date.now()
      
      // Cache valida per 30 secondi
      if (now - timestamp < 30000) {
        try {
          const data = JSON.parse(cachedData)
          console.log('📦 Usando cache da sessionStorage')
          applyData(data)
          setLoading(false)
          setIsLoaded(true)
          return
        } catch (e) {
          console.log('❌ Errore parsing cache')
        }
      } else {
        console.log('⏰ Cache scaduta')
      }
    }

    // 2. Nessuna cache valida → carica da Supabase
    console.log('🔄 Caricamento da Supabase...')
    setLoading(true)
    
    try {
      // 1. Verifica utente
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        setLoading(false)
        return
      }

      // 2. Determina serata
      const serata = getSerataCorrente()
      setSerataCorrente(serata)

      if (serata === 0) {
        const { data: utenteData } = await supabase
          .from('utenti')
          .select('*')
          .eq('id', user.id)
          .single()
        setUtente(utenteData)
        setFestaFinita(true)
        setLoading(false)
        setIsLoaded(true)
        return
      }

      // 3. Carica profilo
      const { data: utenteData } = await supabase
        .from('utenti')
        .select('*')
        .eq('id', user.id)
        .single()
      setUtente(utenteData)

      // 4. Presenza
      const { data: presenzaData } = await supabase
        .from('presenze')
        .select('stato')
        .eq('utente_id', user.id)
        .eq('serata', serata)
        .single()
      if (presenzaData) setStato(presenzaData.stato)

      // 5. Classifica top 5
      const { data: classificaData } = await supabase
        .from('classifica_giocatori')
        .select('*')
        .order('punti_totali', { ascending: false })
        .limit(5)
      setClassifica(classificaData || [])

      // 6. Punti utente
      const { data: puntiData } = await supabase
        .from('classifica_giocatori')
        .select('punti_totali')
        .eq('id', user.id)
        .single()
      if (puntiData) setPuntiTotali(puntiData.punti_totali || 0)

      // 7. Posizione
      const { data: classificaCompleta } = await supabase
        .from('classifica_giocatori')
        .select('id')
        .order('punti_totali', { ascending: false })
      if (classificaCompleta) {
        const index = classificaCompleta.findIndex((c: any) => c.id === user.id)
        setPosizione(index !== -1 ? index + 1 : null)
      }

      // 8. Missioni
      const { data: missioniData } = await supabase
        .from('missioni')
        .select('*')
        .eq('serata', serata)
        .eq('attiva', true)
      setMissioni(missioniData || [])

      // 9. Missioni completate
      const { data: completateData } = await supabase
        .from('completamenti_missioni')
        .select('missione_id')
        .eq('giocatore_id', user.id)
        .eq('serata', serata)
      if (completateData) {
        setMissioniCompletate(completateData.map((c: any) => c.missione_id))
      }

      // 10. Badge
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

      // 11. Squadre dell'utente
      const { data: roseData } = await supabase
        .from('squadra_membri')
        .select('squadra_id')
        .eq('utente_id', user.id)
      setSquadraCount(roseData?.length || 0)

      // 12. Presenze totali
      const { count } = await supabase
        .from('presenze')
        .select('*', { count: 'exact', head: true })
        .eq('serata', serata)
        .eq('stato', 'ci_saro')
      setPresenzeCount(count || 0)

      // 13. Evento
      const { data: eventoData } = await supabase
        .from('eventi')
        .select('*')
        .eq('serata', serata)
        .single()
      setProssimoEvento(eventoData || null)

      // 14. Notifiche
      try {
        const { count: notificheCount } = await supabase
          .from('event_proposals')
          .select('*', { count: 'exact', head: true })
          .eq('stato', 'in_sospeso')
        setNotifiche(notificheCount || 0)
      } catch (e) {
        setNotifiche(0)
      }

      // Salva in sessionStorage
      const dataToCache = {
        utente: utenteData,
        stato: presenzaData?.stato || null,
        classifica: classificaData || [],
        missioni: missioniData || [],
        missioniCompletate: completateData ? completateData.map((c: any) => c.missione_id) : [],
        puntiTotali: puntiData?.punti_totali || 0,
        posizione: posizione,
        badgeSbloccati: badgeSbloccati || [],
        squadraCount: roseData?.length || 0,
        presenzeCount: count || 0,
        prossimoEvento: eventoData || null,
        serataCorrente: serata,
        notifiche: notificheCount || 0,
        festaFinita: false,
      }
      
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache))
      sessionStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()))

    } catch (error) {
      console.error('❌ Errore caricamento:', error)
    } finally {
      setLoading(false)
      setIsLoaded(true)
    }
  }

  // Funzione per applicare i dati dalla cache
  const applyData = (data: any) => {
    setUtente(data.utente)
    setStato(data.stato)
    setClassifica(data.classifica || [])
    setMissioni(data.missioni || [])
    setMissioniCompletate(data.missioniCompletate || [])
    setPuntiTotali(data.puntiTotali || 0)
    setPosizione(data.posizione)
    setBadgeSbloccati(data.badgeSbloccati || [])
    setSquadraCount(data.squadraCount || 0)
    setPresenzeCount(data.presenzeCount || 0)
    setProssimoEvento(data.prossimoEvento)
    setSerataCorrente(data.serataCorrente || 1)
    setNotifiche(data.notifiche || 0)
    setFestaFinita(data.festaFinita || false)
  }

  // Invalida cache (quando cambia presenza o altre azioni)
  const invalidateCache = () => {
    sessionStorage.removeItem(CACHE_KEY)
    sessionStorage.removeItem(CACHE_TIMESTAMP_KEY)
  }

  // Gestione presenza
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
      invalidateCache()
      loadData()
    }
  }

  // ============================================
  // LOADING
  // ============================================
  if (loading && !isLoaded) {
    return <LoadingSpinner />
  }

  // ============================================
  // FESTA FINITA
  // ============================================
  if (festaFinita) {
    return (
      <PageTransition>
        <main className="min-h-dvh bg-bordeaux-deep">
          <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-bordeaux-deep items-center justify-center px-4">
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-gold mb-4">
                Festa delle Cantine 2026
              </h1>
              <p className="text-xl text-parchment/80 mb-2">
                La festa è finita!
              </p>
              <p className="text-parchment/60">
                Grazie per aver partecipato. Ci vediamo il prossimo anno! 🍷
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-6 px-6 py-3 bg-gold text-bordeaux-dark rounded-xl font-bold hover:bg-gold/80 transition"
              >
                Torna alla home
              </button>
            </div>
          </div>
        </main>
      </PageTransition>
    )
  }

  const displayName = utente?.soprannome || utente?.nome || 'Bomba'
  const dataIscrizione = utente?.created_at 
    ? new Date(utente.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long' })
    : '2026'

  // ============================================
  // DASHBOARD
  // ============================================
  return (
    <PageTransition>
      <main className="min-h-dvh bg-bordeaux-deep">
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-bordeaux-deep">
          <HeroBanner notifiche={notifiche} />

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
              isOver={festaFinita}
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
    </PageTransition>
  )
}
