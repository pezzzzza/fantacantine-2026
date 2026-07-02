'use client'

import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

export function UpdateFooter({
  lastUpdated,
  isRefreshing,
  onRefresh,
}: {
  lastUpdated: string
  isRefreshing: boolean
  onRefresh: () => void
}) {
  return (
    <div className="mx-4 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-night-soft/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-wine px-2.5 py-1">
          <motion.span
            className="h-2 w-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[11px] font-bold uppercase tracking-wide text-parchment">
            Live
          </span>
        </span>
        <div className="leading-tight">
          <p className="text-[11px] text-parchment/60">Ultimo aggiornamento:</p>
          <p className="text-sm font-semibold text-gold">{lastUpdated}</p>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 font-bold uppercase tracking-wide text-night-deep shadow-md disabled:opacity-80"
      >
        <motion.span
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isRefreshing
              ? { duration: 1, repeat: Infinity, ease: 'linear' }
              : { duration: 0.2 }
          }
        >
          <RefreshCw className="h-4 w-4" />
        </motion.span>
        Aggiorna
      </motion.button>
    </div>
  )
}
