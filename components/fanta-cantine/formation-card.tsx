"use client"

import { useEffect, useState } from "react"
import { ClipboardList, ChevronRight } from "lucide-react"

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

export function FormationCard() {
  // Start at 05:12:47 and count down
  const [seconds, setSeconds] = useState(5 * 3600 + 12 * 60 + 47)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const units = [
    { value: pad(h), label: "ORE" },
    { value: pad(m), label: "MIN" },
    { value: pad(s), label: "SEC" },
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
          <p className="text-xs font-medium text-muted-foreground">Scade tra</p>
          <div className="mt-0.5 flex items-end gap-1 font-mono tabular-nums">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-end gap-1">
                <div className="text-center">
                  <span className="block text-xl font-extrabold leading-none text-primary">
                    {u.value}
                  </span>
                  <span className="text-[9px] font-semibold tracking-wide text-muted-foreground">
                    {u.label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className="pb-3 text-xl font-extrabold text-primary/60">
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
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-md transition-all active:scale-[0.98] hover:brightness-110"
      >
        Modifica Formazione
        <ChevronRight className="size-5" />
      </button>
    </section>
  )
}
