'use client'

interface ProfileCardProps {
  nome: string
  soprannome?: string
  puntiTotali: number
  posizione: number | null
  badgeCount: number
  squadreCount: number
  dataIscrizione?: string
}

// Calcola il livello in base ai punti
const getLivello = (punti: number): number => {
  if (punti < 10) return 1
  if (punti < 25) return 2
  if (punti < 50) return 3
  if (punti < 80) return 4
  if (punti < 120) return 5
  if (punti < 170) return 6
  if (punti < 230) return 7
  if (punti < 300) return 8
  if (punti < 380) return 9
  if (punti < 470) return 10
  if (punti < 570) return 11
  return 12
}

export function ProfileCard({
  nome,
  soprannome,
  puntiTotali,
  posizione,
  badgeCount,
  squadreCount,
  dataIscrizione
}: ProfileCardProps) {
  const displayName = soprannome || nome || 'Bomba'
  const livello = getLivello(puntiTotali)

  return (
    <section className="rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-lg shadow-black/30">
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-gold shadow-md bg-gold/20 flex items-center justify-center text-3xl font-bold text-primary">
          {displayName[0]}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold leading-tight">
            Ciao <span className="text-primary">{displayName}!</span>{" "}
            <span aria-hidden>👋</span>
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            Allenatore da {dataIscrizione || '2026'}
          </p>
        </div>

        <div className="flex items-center gap-3 pl-1">
          <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <span className="text-gold text-2xl">⭐</span>
          </div>
          <div className="border-l border-border pl-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Livello
            </p>
            <p className="text-2xl font-extrabold leading-none">{livello}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-border border-t border-border pt-3">
        <div className="px-1 text-center">
          <p className="text-[11px] font-medium text-muted-foreground">Punti totali</p>
          <p className="mt-0.5 text-xl font-extrabold text-primary">{puntiTotali}</p>
        </div>
        <div className="px-1 text-center">
          <p className="text-[11px] font-medium text-muted-foreground">Posizione</p>
          <p className="mt-0.5 text-xl font-extrabold text-primary">{posizione || '-'}</p>
        </div>
        <div className="px-1 text-center">
          <p className="text-[11px] font-medium text-muted-foreground">Squadre</p>
          <p className="mt-0.5 text-xl font-extrabold text-primary">{squadreCount}</p>
        </div>
        <div className="px-1 text-center">
          <p className="text-[11px] font-medium text-muted-foreground">Badge</p>
          <p className="mt-0.5 text-xl font-extrabold text-primary">{badgeCount}</p>
        </div>
      </div>
    </section>
  )
}
