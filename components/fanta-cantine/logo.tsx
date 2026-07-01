import { Star } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <h1 className="font-display leading-[0.85] tracking-tight drop-shadow-vintage">
          <span className="block text-5xl font-black text-parchment sm:text-6xl">
            FANTA
            <Star
              className="ml-1 inline-block size-8 -translate-y-4 fill-gold text-gold sm:size-10"
              strokeWidth={1}
              aria-hidden="true"
            />
          </span>
          <span className="mt-1 block text-6xl font-black text-gold sm:text-7xl">
            CANTINE
          </span>
        </h1>
      </div>

      {/* Ribbon subtitle */}
      <div className="relative mt-3 max-w-[19rem]">
        <div className="rounded-md border border-gold/50 bg-bordeaux-deep/80 px-4 py-2 shadow-lg shadow-black/40">
          <p className="font-heading text-[0.7rem] font-bold uppercase leading-tight tracking-[0.12em] text-parchment/90">
            Il Fantasy Game della
            <br />
            Festa delle Cantine di Configni
          </p>
        </div>
      </div>
    </div>
  )
}
