'use client'

import { CheckCircle2, HelpCircle, XCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type Choice = 'ci_saro' | 'forse' | 'non_ci_saro' | null

interface PresenceSelectorProps {
  stato: Choice
  onPresenza: (stato: Choice) => void
  presenzeCount: number
}

const options = [
  {
    id: 'ci_saro' as const,
    label: "CI SARÒ",
    Icon: CheckCircle2,
    base: "bg-success text-success-foreground",
    ring: "ring-success",
  },
  {
    id: 'forse' as const,
    label: "FORSE",
    Icon: HelpCircle,
    base: "bg-gold text-gold-foreground",
    ring: "ring-gold",
  },
  {
    id: 'non_ci_saro' as const,
    label: "NON CI SARÒ",
    Icon: XCircle,
    base: "bg-destructive text-white",
    ring: "ring-destructive",
  },
]

export function PresenceSelector({ stato, onPresenza, presenzeCount }: PresenceSelectorProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-panel p-4 text-panel-foreground shadow-lg shadow-black/30">
      <h2 className="text-center text-lg font-extrabold uppercase tracking-wide">
        La tua presenza oggi
      </h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {options.map(({ id, label, Icon, base, ring }) => {
          const active = stato === id
          const dimmed = stato !== null && !active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPresenza(id)}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 font-bold shadow-md transition-all duration-200 active:scale-95",
                base,
                active && ["scale-[1.04] ring-4 ring-offset-2 ring-offset-panel", ring],
                dimmed && "opacity-45 saturate-50",
              )}
            >
              <Icon className={cn("size-7 transition-transform", active && "scale-110")} />
              <span className="text-xs leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-panel-foreground/70">
        <Users className="size-4" />
        {presenzeCount} partecipanti ti vedranno!
      </p>
    </section>
  )
}