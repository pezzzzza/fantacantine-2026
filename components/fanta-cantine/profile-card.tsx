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

const getLivelloInfo = (punti: number): { livello: number, nome: string, prossimo: number, progresso: number } => {
  const livelli = [
    { livello: 1, nome: 'Novizio', punti: 0 },
    { livello: 2, nome: 'Apprendista', punti: 10 },
    { livello: 3, nome: 'Conoscitore', punti: 25 },
    { livello: 4, nome: 'Esperto', punti: 50 },
    { livello: 5, nome: 'Maestro', punti: 80 },
    { livello: 6, nome: 'Grande Maestro', punti: 120 },
    { livello: 7, nome: 'Sommellier', punti: 170 },
    { livello: 8, nome: 'Assaggiatore', punti: 230 },
    { livello: 9, nome: 'Cantiniere', punti: 300 },
    { livello: 10, nome: 'Enologo', punti: 380 },
    { livello: 11, nome: 'Vignaiolo', punti: 470 },
    { livello: 12, nome: 'Maestro Cantiniere', punti: 570 },
    { livello: 13, nome: 'Leggenda', punti: 700 },
    { livello: 14, nome: 'Icona', punti: 850 },
    { livello: 15, nome: 'Mito', punti: 1000 },
  ]
  
  let info = livelli[0]
  let index = 0
  for (let i = 0; i < livelli.length; i++) {
    if (punti >= livelli[i].punti) {
      info = livelli[i]
      index = i
    }
  }
  
  const prossimoLivello = livelli[index + 1]
  const puntiLivelloCorrente = info.punti
  const puntiProssimo = prossimoLivello?.punti || info.punti
  const progresso = prossimoLivello 
    ? Math.min(100, Math.round(((punti - puntiLivelloCorrente) / (puntiProssimo - puntiLivelloCorrente)) * 100))
    : 100
  
  return {
    livello: info.livello,
    nome: info.nome,
    prossimo: puntiProssimo,
    progresso: progresso
  }
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
  const info = getLivelloInfo(puntiTotali)

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
            <span className="text-gold text-xl">⭐</span>
          </div>
          <div className="border-l border-border pl-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {info.nome}
            </p>
            <p className="text-2xl font-extrabold leading-none">{info.livello}</p>
          </div>
        </div>
      </div>

      {/* Barra di progresso verso il prossimo livello */}
      {info.progresso < 100 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span>{info.progresso}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${info.progresso}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-right">
            Prossimo livello: {info.prossimo} punti
          </p>
        </div>
      )}

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
