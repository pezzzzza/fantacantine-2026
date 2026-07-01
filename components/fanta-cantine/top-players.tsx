'use client'

import { Trophy, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TopPlayersProps {
  classifica: any[]
}

const medalColor: Record<number, string> = {
  1: "bg-gold text-gold-foreground",
  2: "bg-slate-300 text-slate-800",
  3: "bg-amber-700 text-amber-50",
}

export function TopPlayers({ classifica }: TopPlayersProps) {
  if (classifica.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase text-foreground">
            <Trophy className="size-6 text-gold" />
            Top Giocatori
          </h2>
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground">
          ⏳ Nessun punteggio ancora assegnato
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase text-foreground">
          <Trophy className="size-6 text-gold" />
          Top Giocatori
        </h2>
        <Link
          href="/classifiche"
          className="flex items-center gap-0.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-gold"
        >
          Vedi tutte
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {classifica.map((p, index) => {
          const rank = index + 1
          return (
            <article
              key={p.id}
              className={cn(
                "relative flex w-28 shrink-0 flex-col items-center rounded-2xl border border-border bg-card p-3 pt-5 text-card-foreground shadow-md transition-transform active:scale-95",
                rank === 2 && "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute left-1/2 top-2 z-10 flex size-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-extrabold shadow-sm ring-2 ring-card",
                  medalColor[rank] ?? "bg-muted text-muted-foreground",
                )}
              >
                {rank}
              </span>
              <div
                className={cn(
                  "relative size-16 overflow-hidden rounded-full ring-2 bg-gold/20 flex items-center justify-center text-2xl font-bold text-primary",
                  rank <= 3 ? "ring-gold" : "ring-border",
                )}
              >
                {p.soprannome?.[0] || p.nome?.[0] || '?'}
              </div>
              <p className="mt-2 w-full truncate text-center text-xs font-extrabold uppercase">
                {p.soprannome || p.nome || 'Anonimo'}
              </p>
              <p className="text-sm font-extrabold text-primary">
                {p.punti_totali} <span className="text-xs font-bold">pt</span>
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}