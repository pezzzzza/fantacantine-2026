import Image from "next/image"
import { CalendarDays } from "lucide-react"

export function NextEventCard() {
  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
      <h2 className="flex items-center gap-2 text-base font-extrabold uppercase leading-tight">
        <CalendarDays className="size-5 text-primary" />
        Prossimo evento
      </h2>

      <div className="mt-3 flex flex-1 items-center gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border">
          <Image
            src="/event-orchestra.png"
            alt="Orchestra sul palco"
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Stasera</p>
          <p className="text-lg font-extrabold leading-tight">21 Agosto</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Orchestra
          </p>
          <p className="text-sm font-extrabold uppercase leading-tight text-primary text-balance">
            I Ragazzi del Sabato
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
