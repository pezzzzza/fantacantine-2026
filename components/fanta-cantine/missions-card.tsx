'use client'

import { CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

interface MissionsCardProps {
  missioni: any[]
  completate: string[]
}

export function MissionsCard({ missioni, completate }: MissionsCardProps) {
  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-extrabold uppercase leading-tight">
          Missioni di oggi
        </h2>
        <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-sm font-bold text-primary">
          {completate.length}/{missioni.length}
        </span>
      </div>

      <ul className="mt-3 flex-1 space-y-2.5">
        {missioni.length === 0 ? (
          <li className="text-sm text-muted-foreground text-center py-4">
            ⏳ Nessuna missione disponibile
          </li>
        ) : (
          missioni.slice(0, 5).map((m) => {
            const completata = completate.includes(m.id)
            return (
              <li key={m.id} className={`flex items-start gap-2 text-sm font-medium ${completata ? 'opacity-50 line-through' : ''}`}>
                <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${completata ? 'text-success' : 'text-muted-foreground'}`} />
                <span className="text-pretty">{m.descrizione}</span>
              </li>
            )
          })
        )}
      </ul>

      <Link
        href="/missioni"
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-extrabold uppercase tracking-wide text-primary-foreground shadow-md transition-all active:scale-[0.98] hover:brightness-110"
      >
        Vedi tutte le missioni
        <ChevronRight className="size-4" />
      </Link>
    </section>
  )
}