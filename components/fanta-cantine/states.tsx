'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Loader2, Trophy } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-gold-deep" />
      <p className="font-serif text-cream-ink/70">Caricamento classifica…</p>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="h-12 w-12 text-wine-text" />
      <p className="font-serif text-cream-ink/80">
        Si è verificato un errore nel caricamento.
      </p>
      <motion.button
        type="button"
        onClick={onRetry}
        whileTap={{ scale: 0.94 }}
        className="rounded-xl border border-gold-deep bg-wine px-6 py-2.5 font-bold uppercase tracking-wide text-gold shadow-md"
      >
        Riprova
      </motion.button>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Trophy className="h-12 w-12 text-gold-deep/60" />
      <p className="font-serif text-cream-ink/70">Nessun dato disponibile</p>
    </div>
  )
}
