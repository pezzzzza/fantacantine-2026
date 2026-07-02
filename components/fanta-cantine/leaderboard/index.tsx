'use client'

import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getClassificaSquadre, getClassificaGiocatori } from '@/lib/leaderboard-data'
import { LeaderboardHeader } from './leaderboard-header'
import { LeaderboardTabs, type TabKey } from './leaderboard-tabs'
import { TeamRow } from './team-row'
import { PlayerRow } from './player-row'
import { UpdateFooter } from './update-footer'
import { LeaderboardBottomNav } from './leaderboard-bottom-nav'
import { EmptyState, ErrorState, LoadingState } from './states'
import { createClient } from '@/lib/supabase/client'

type Status = 'loading' | 'error' | 'ready'

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

function formatNow() {
  const d = new Date()
  const months = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
  ]
  const time = d.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${time}`
}

export function Leaderboard() {
  const [tab, setTab] = useState<TabKey>('squadre')
  const [teams, setTeams] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(formatNow())

  const supabase = createClient()

  // Carica i dati reali
  const loadData = async () => {
    setStatus('loading')
    try {
      // Prendi l'ID dell'utente loggato
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id

      // Carica classifica squadre e giocatori
      const [squadre, giocatori] = await Promise.all([
        getClassificaSquadre(userId),
        getClassificaGiocatori(userId)
      ])

      setTeams(squadre)
      setPlayers(giocatori)
      setStatus('ready')
    } catch (error) {
      console.error('Errore caricamento classifica:', error)
      setStatus('error')
    }
  }

  // Carica all'avvio
  useEffect(() => {
    loadData()
  }, [])

  // Handle refresh
  function handleRefresh() {
    if (isRefreshing) return
    setIsRefreshing(true)
    loadData().then(() => {
      setLastUpdated(formatNow())
      setIsRefreshing(false)
    })
  }

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.rank - b.rank),
    [teams],
  )
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.rank - b.rank),
    [players],
  )

  const isEmpty =
    tab === 'squadre' ? sortedTeams.length === 0 : sortedPlayers.length === 0

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-[#14213d]">
      <LeaderboardHeader />

      <LeaderboardTabs active={tab} onChange={setTab} />

      <div className="flex-1 px-4 pb-4 pt-4">
        <div className="rounded-3xl border border-[#e8c46a]/30 bg-[#f5efe6] px-2 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState onRetry={loadData} />}
          {status === 'ready' && isEmpty && <EmptyState />}

          {status === 'ready' && !isEmpty && (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === 'squadre' ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === 'squadre' ? 24 : -24 }}
                transition={{ duration: 0.25 }}
              >
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  role="list"
                >
                  {tab === 'squadre'
                    ? sortedTeams.map((team, i) => (
                        <TeamRow
                          key={team.id}
                          team={team}
                          isLast={i === sortedTeams.length - 1}
                        />
                      ))
                    : sortedPlayers.map((player, i) => (
                        <PlayerRow
                          key={player.id}
                          player={player}
                          isLast={i === sortedPlayers.length - 1}
                        />
                      ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <UpdateFooter
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </div>

      <LeaderboardBottomNav />
    </main>
  )
}
