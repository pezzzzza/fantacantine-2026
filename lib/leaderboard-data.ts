// lib/leaderboard-data.ts
import { createClient } from '@/lib/supabase/client'

export type Crest =
  | 'grape'
  | 'glass'
  | 'barrel'
  | 'music'
  | 'leaf'
  | 'corkscrew'
  | 'wine'

export type Team = {
  id: string
  rank: number
  name: string
  coach: string
  points: number
  crest: Crest
  crestColor: string
  isUser?: boolean
}

export type Player = {
  id: string
  rank: number
  name: string
  points: number
  isUser?: boolean
}

// Mappa colori per gli stemmi
const CREST_COLORS: Record<Crest, string> = {
  grape: '#7d1f2d',
  glass: '#1d2f57',
  barrel: '#5b3a86',
  music: '#7d1f2d',
  leaf: '#2f5133',
  corkscrew: '#5a3a24',
  wine: '#1c5a56',
}

// ============================================
// FUNZIONI PER CARICARE DATI REALI DA SUPABASE
// ============================================

export async function getClassificaSquadre(userId?: string): Promise<Team[]> {
  const supabase = createClient()
  
  // 1. Prendi i dati dalla vista classifica_squadre
  const { data: squadre, error } = await supabase
    .from('classifica_squadre')
    .select('*')
    .order('punti_totali', { ascending: false })

  if (error) {
    console.error('Errore caricamento classifica squadre:', error)
    return getMockTeams()
  }

  if (!squadre || squadre.length === 0) {
    return getMockTeams()
  }

  // 2. Per ogni squadra, prendi il nome dell'allenatore
  const result: Team[] = []
  const crests: Crest[] = ['grape', 'glass', 'barrel', 'music', 'leaf', 'corkscrew', 'wine']
  
  for (let i = 0; i < squadre.length; i++) {
    const s = squadre[i]
    
    // Prendi il nome dell'allenatore
    const { data: allenatore } = await supabase
      .from('utenti')
      .select('nome, soprannome')
      .eq('id', s.allenatore_id)
      .single()
    
    const crest = crests[i % crests.length]
    
    result.push({
      id: s.id,
      rank: i + 1,
      name: s.nome_squadra || 'Squadra senza nome',
      coach: allenatore?.soprannome || allenatore?.nome || 'Sconosciuto',
      points: s.punti_totali || 0,
      crest: crest,
      crestColor: CREST_COLORS[crest],
      isUser: s.allenatore_id === userId
    })
  }
  
  return result
}

export async function getClassificaGiocatori(userId?: string): Promise<Player[]> {
  const supabase = createClient()
  
  const { data: giocatori, error } = await supabase
    .from('classifica_giocatori')
    .select('*')
    .order('punti_totali', { ascending: false })

  if (error) {
    console.error('Errore caricamento classifica giocatori:', error)
    return getMockPlayers()
  }

  if (!giocatori || giocatori.length === 0) {
    return getMockPlayers()
  }

  return giocatori.map((g, i) => ({
    id: g.id,
    rank: i + 1,
    name: g.soprannome || g.nome || 'Anonimo',
    points: g.punti_totali || 0,
    isUser: g.id === userId
  }))
}

// ============================================
// DATI MOCK (FALLBACK - usati solo se Supabase è vuoto)
// ============================================

function getMockTeams(): Team[] {
  return [
    { id: 't1', rank: 1, name: 'I GHIOTTONI', coach: 'Marco', points: 520, crest: 'grape', crestColor: '#7d1f2d' },
    { id: 't2', rank: 2, name: 'I BICCHIERI', coach: 'Luca', points: 480, crest: 'glass', crestColor: '#1d2f57' },
    { id: 't3', rank: 3, name: 'I BRINDISI', coach: 'Sara', points: 450, crest: 'grape', crestColor: '#2f5133' },
    { id: 't4', rank: 4, name: 'I GOLOSI', coach: 'Paolo', points: 420, crest: 'barrel', crestColor: '#5b3a86' },
    { id: 't5', rank: 5, name: 'I FESTAIOLI', coach: 'Giulia', points: 390, crest: 'music', crestColor: '#7d1f2d' },
    { id: 't6', rank: 6, name: 'I CONFIGNI', coach: 'Bomba', points: 370, crest: 'grape', crestColor: '#5e1420', isUser: true },
    { id: 't7', rank: 7, name: 'I VIGNAIOLI', coach: 'Davide', points: 340, crest: 'leaf', crestColor: '#2f5133' },
    { id: 't8', rank: 8, name: 'GLI STAPPATORI', coach: 'Antonio', points: 310, crest: 'music', crestColor: '#1d2f57' },
    { id: 't9', rank: 9, name: 'I SORSI FELICI', coach: 'Chiara', points: 280, crest: 'corkscrew', crestColor: '#5a3a24' },
    { id: 't10', rank: 10, name: 'LE LEGGENDE', coach: 'Matteo', points: 250, crest: 'wine', crestColor: '#1c5a56' },
  ]
}

function getMockPlayers(): Player[] {
  return [
    { id: 'p1', rank: 1, name: 'MARCO R.', points: 320 },
    { id: 'p2', rank: 2, name: 'LUCA B.', points: 290 },
    { id: 'p3', rank: 3, name: 'SARA C.', points: 260 },
    { id: 'p4', rank: 4, name: 'PAOLO M.', points: 230 },
    { id: 'p5', rank: 5, name: 'GIULIA F.', points: 200, isUser: true },
    { id: 'p6', rank: 6, name: 'ALESSANDRO G.', points: 180 },
    { id: 'p7', rank: 7, name: 'ELENA P.', points: 150 },
    { id: 'p8', rank: 8, name: 'FRANCESCO T.', points: 120 },
    { id: 'p9', rank: 9, name: 'MARTA L.', points: 90 },
    { id: 'p10', rank: 10, name: 'ROBERTO S.', points: 60 },
  ]
}
