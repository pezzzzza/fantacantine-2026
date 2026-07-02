'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Wine, Grape, Star } from 'lucide-react'

export function LeaderboardHeader({ onBack }: { onBack?: () => void }) {
  return (
    <header className="relative overflow-hidden bg-night-deep px-4 pb-6 pt-4">
      {/* string lights */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute top-3 h-1.5 w-1.5 rounded-full bg-gold-bright shadow-[0_0_8px_2px_rgba(246,217,126,0.6)]"
            style={{ left: `${8 + i * 11}%`, top: `${6 + (i % 2) * 10}px` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* twinkling stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <Star
            key={i}
            className="absolute text-gold/40"
            style={{
              left: `${(i * 37) % 95}%`,
              top: `${20 + ((i * 53) % 70)}%`,
              width: i % 3 === 0 ? 10 : 6,
              height: i % 3 === 0 ? 10 : 6,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className="relative">
        <motion.button
          type="button"
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-wine text-gold shadow-md"
          aria-label="Torna indietro"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div className="mt-1 flex items-center justify-center gap-3">
          <motion.div
            initial={{ rotate: -12, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <Trophy className="h-12 w-12 text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" fill="#e8c46a" />
          </motion.div>

          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black uppercase tracking-wide text-gold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          >
            Classifica
          </motion.h1>

          <div className="flex flex-col items-center">
            <Grape className="h-7 w-7 text-wine" fill="#5e1420" />
            <Wine className="h-7 w-7 text-gold" fill="#e8c46a" />
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-2 w-fit rounded-md border border-gold/50 bg-wine px-5 py-1.5 shadow-md"
        >
          <p className="font-serif text-sm font-semibold tracking-wide text-parchment">
            Festa delle Cantine 2026
          </p>
        </motion.div>
      </div>
    </header>
  )
}
