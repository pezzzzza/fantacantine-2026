'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { players, teams } from '@/lib/leaderboard-data'
import { LeaderboardHeader } from './leaderboard-header'
import { LeaderboardTabs, type TabKey } from './leaderboard-tabs'
import { TeamRow } from './team-row'
import { PlayerRow } from './player-row'
import { UpdateFooter } from './update-footer'
import { BottomNav } from './bottom-nav'
import { EmptyState, ErrorState, LoadingState } from './states'

type Status = 'loading' | 'error' | 'ready'

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

function formatNow() {
  const d = new Date('2026-08-21T22:45:00')
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
  const [status] = useState<Status>('ready')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(formatNow())

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.rank - b.rank),
    [],
  )
  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.rank - b.rank),
    [],
  )

  const isEmpty =
    tab === 'squadre' ? sortedTeams.length === 0 : sortedPlayers.length === 0

  function handleRefresh() {
    if (isRefreshing) return
    setIsRefreshing(true)
    setTimeout(() => {
      const now = new Date()
      const months = [
        'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
        'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
      ]
      const time = now.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
      })
      setLastUpdated(
        `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${time}`,
      )
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-night">
      <LeaderboardHeader />

      <LeaderboardTabs active={tab} onChange={setTab} />

      <div className="flex-1 px-4 pb-4 pt-4">
        <div className="rounded-3xl border border-parchment-line bg-parchment px-2 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState onRetry={() => {}} />}
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

      <BottomNav />
    </main>
  )
}
