'use client'

import { CalendarDays } from "lucide-react"

interface Evento {
  id: string
  nome: string
  data: string
  descrizione: string
  immagine_url: string
  serata: number
}

interface NextEventCardProps {
  evento?: Evento | null
}

export function NextEventCard({ evento }: NextEventCardProps) {
  if (!evento) {
    return (
      <section className="flex flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
        <h2 className="flex items-center gap-2 text-base font-extrabold uppercase leading-tight">
          <CalendarDays className="size-5 text-primary" />
          Prossimo evento
        </h2>
        <div className="mt-3 text-center text-muted-foreground text-sm py-4">
          ⏳ Nessun evento in programma
        </div>
      </section>
    )
  }

  const dataFormattata = new Date(evento.data).toLocaleDateString('it-IT', { 
    day: 'numeric', 
    month: 'long' 
  })

  const getEventEmoji = (nome: string) => {
    if (nome.toLowerCase().includes('dj')) return '🎧'
    if (nome.toLowerCase().includes('orchestra')) return '🎻'
    return '🎵'
  }

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
      <h2 className="flex items-center gap-2 text-base font-extrabold uppercase leading-tight">
        <CalendarDays className="size-5 text-primary" />
        Prossimo evento
      </h2>

      <div className="mt-3 flex flex-1 items-center gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border bg-gold/10 flex items-center justify-center text-4xl">
          {getEventEmoji(evento.nome)}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Stasera</p>
          <p className="text-lg font-extrabold leading-tight">{dataFormattata}</p>
          <p className="mt-1 text-sm font-extrabold uppercase leading-tight text-primary text-balance">
            {evento.nome}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-gold px-3 py-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-foreground shadow-md transition-all active:scale-[0.98] hover:brightness-105"
      >
        Scopri il programma
      </button>
    </section>
  )
}
