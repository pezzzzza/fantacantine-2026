"use client"

import { ClipboardList, ChevronRight } from "lucide-react"

interface FormationCardProps {
  ore: number
  minuti: number
  secondi: number
  isOver?: boolean
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function FormationCard({ ore, minuti, secondi, isOver }: FormationCardProps) {
  // Se il timer è scaduto o la festa è finita
  const isScaduto = isOver || (ore === 0 && minuti === 0 && secondi === 0)

  const units = [
    { value: pad(ore), label: "ORE" },
    { value: pad(minuti), label: "MIN" },
    { value: pad(secondi), label: "SEC" },
  ]

  return (
    <section className="rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
      <div className="flex items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gold/20 ring-1 ring-gold/40">
          <ClipboardList className="size-7 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-extrabold uppercase leading-tight">
            Formazione di oggi
          </h2>
          <p className="text-xs font-medium text-muted-foreground">
            {isScaduto ? (
              isOver ? "🎉 Festa finita!" : "⏰ Tempo scaduto!"
            ) : (
              "Scade tra"
            )}
          </p>
          <div className="mt-0.5 flex items-end gap-1 font-mono tabular-nums">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-end gap-1">
                <div className="text-center">
                  <span className={`block text-xl font-extrabold leading-none ${isScaduto ? 'text-destructive' : 'text-primary'}`}>
                    {u.value}
                  </span>
                  <span className="text-[9px] font-semibold tracking-wide text-muted-foreground">
                    {u.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className={`pb-3 text-xl font-extrabold ${isScaduto ? 'text-destructive/60' : 'text-primary/60'}`}>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-wide shadow-md transition-all active:scale-[0.98] ${
          isScaduto 
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
            : 'bg-primary text-primary-foreground hover:brightness-110'
        }`}
        disabled={isScaduto}
      >
        {isScaduto ? (isOver ? '🎉 Festa finita' : '⏰ Scaduto') : 'Modifica Formazione'}
        {!isScaduto && <ChevronRight className="size-5" />}
      </button>
    </section>
  )
}
