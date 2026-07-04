// lib/supabase/giudice-queries.ts
import { createClient } from './client'

// ============================================
// TIPI
// ============================================

export interface Utente {
  id: string
  nome: string
  cognome: string
  soprannome?: string
  points: number
  posizione: number | null
  squadre: number
  badge: number
  ruolo: 'giocatore' | 'giudice' | 'admin'
}

export interface BonusMalus {
  id: string
  nome_evento: string
  punti: number
  categoria: 'bonus' | 'malus' | 'bonus_speciale'
  descrizione?: string
  icona?: string
}

export interface Proposta {
  id: string
  utente_id: string
  bonus_malus_id: string
  proposto_da: string
  stato: 'in_sospeso' | 'confermato' | 'rifiutato' | 'scaduto'
  scade_il: string
  created_at: string
  utente_nome?: string
  utente_cognome?: string
  bonus_nome?: string
  bonus_punti?: number
  proposto_da_nome?: string
}

export interface Conferma {
  id: string
  proposal_id: string
  confermato_da: string
  created_at: string
}

// ============================================
// FUNZIONI SUPABASE
// ============================================

export async function getUtenti(): Promise<Utente[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('utenti')
    .select('*')
    .order('nome', { ascending: true })

  if (error) {
    console.error('Errore caricamento utenti:', error)
    return []
  }

  // Calcola punti, posizione, squadre, badge per ogni utente
  const utentiConDati = await Promise.all(
    (data || []).map(async (u) => {
      // 1. Punti totali
      const { data: puntiData } = await supabase
        .from('classifica_giocatori')
        .select('punti_totali')
        .eq('id', u.id)
        .single()

      // 2. Posizione
      const { data: posizioneData } = await supabase
        .from('classifica_giocatori')
        .select('id')
        .order('punti_totali', { ascending: false })
      
      let posizione = null
      if (posizioneData) {
        const index = posizioneData.findIndex((c: any) => c.id === u.id)
        posizione = index !== -1 ? index + 1 : null
      }

      // 3. Numero squadre
      const { count: squadreCount } = await supabase
        .from('squadra_membri')
        .select('*', { count: 'exact', head: true })
        .eq('utente_id', u.id)

      // 4. Numero badge (se tabella esiste)
      let badgeCount = 0
      try {
        const { count } = await supabase
          .from('badge_assegnati')
          .select('*', { count: 'exact', head: true })
          .eq('utente_id', u.id)
        badgeCount = count || 0
      } catch (e) {
        badgeCount = 0
      }

      return {
        id: u.id,
        nome: u.nome,
        cognome: u.cognome || '',
        soprannome: u.soprannome,
        points: puntiData?.punti_totali || 0,
        posizione: posizione,
        squadre: squadreCount || 0,
        badge: badgeCount,
        ruolo: u.ruolo || 'giocatore',
      }
    })
  )

  return utentiConDati
}

export async function getBonusMalus(): Promise<BonusMalus[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bonus_malus_catalog')
    .select('*')
    .order('categoria', { ascending: true })

  if (error) {
    console.error('Errore caricamento bonus/malus:', error)
    return []
  }

  return data || []
}

export async function getProposteInSospeso(): Promise<Proposta[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('event_proposals')
    .select(`
      *,
      utenti:utente_id (nome, cognome),
      bonus_malus_catalog:bonus_malus_id (nome_evento, punti),
      proposti_da:proposto_da (nome, cognome)
    `)
    .eq('stato', 'in_sospeso')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Errore caricamento proposte:', error)
    return []
  }

  return (data || []).map((p) => ({
    ...p,
    utente_nome: p.utenti?.nome,
    utente_cognome: p.utenti?.cognome,
    bonus_nome: p.bonus_malus_catalog?.nome_evento,
    bonus_punti: p.bonus_malus_catalog?.punti,
    proposto_da_nome: p.proposti_da?.nome,
  }))
}

export async function getStorico(): Promise<Proposta[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('event_proposals')
    .select(`
      *,
      utenti:utente_id (nome, cognome),
      bonus_malus_catalog:bonus_malus_id (nome_evento, punti),
      proposti_da:proposto_da (nome, cognome)
    `)
    .in('stato', ['confermato', 'rifiutato'])
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Errore caricamento storico:', error)
    return []
  }

  return (data || []).map((p) => ({
    ...p,
    utente_nome: p.utenti?.nome,
    utente_cognome: p.utenti?.cognome,
    bonus_nome: p.bonus_malus_catalog?.nome_evento,
    bonus_punti: p.bonus_malus_catalog?.punti,
    proposto_da_nome: p.proposti_da?.nome,
  }))
}

export async function creaProposta(
  utenteId: string,
  bonusMalusId: string,
  propostoDa: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('event_proposals')
    .insert({
      utente_id: utenteId,
      bonus_malus_id: bonusMalusId,
      proposto_da: propostoDa,
      stato: 'in_sospeso',
      scade_il: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    })

  if (error) {
    console.error('Errore creazione proposta:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function confermaProposta(
  proposalId: string,
  confermatoDa: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  // 1. Controlla che la proposta esista e sia in sospeso
  const { data: proposta, error: fetchError } = await supabase
    .from('event_proposals')
    .select('*')
    .eq('id', proposalId)
    .single()

  if (fetchError || !proposta) {
    return { success: false, error: 'Proposta non trovata' }
  }

  if (proposta.stato !== 'in_sospeso') {
    return { success: false, error: 'Proposta già processata' }
  }

  if (proposta.proposto_da === confermatoDa) {
    return { success: false, error: 'Non puoi confermare la tua stessa proposta' }
  }

  // 2. Crea la conferma
  const { error: confirmError } = await supabase
    .from('event_confirmations')
    .insert({
      proposal_id: proposalId,
      confermato_da: confermatoDa,
    })

  if (confirmError) {
    return { success: false, error: confirmError.message }
  }

  // 3. Aggiorna lo stato della proposta
  const { error: updateError } = await supabase
    .from('event_proposals')
    .update({ stato: 'confermato' })
    .eq('id', proposalId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // 4. Crea evento nel log
  const { error: logError } = await supabase
    .from('events_log')
    .insert({
      utente_id: proposta.utente_id,
      bonus_malus_id: proposta.bonus_malus_id,
      fonte: 'giudice',
    })

  if (logError) {
    console.error('Errore creazione log:', logError)
    // Non blocchiamo il flusso per questo
  }

  return { success: true }
}

export async function rifiutaProposta(
  proposalId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('event_proposals')
    .update({ stato: 'rifiutato' })
    .eq('id', proposalId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
