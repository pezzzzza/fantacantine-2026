import Image from "next/image"
import { Menu, Bell } from "lucide-react"

export function HeroBanner() {
  return (
    <header className="relative">
      <div className="relative aspect-[9/8] w-full overflow-hidden">
        <Image
          src="/hero-fanta-cantine.png"
          alt="Fanta Cantine — il fantasy game della Festa delle Cantine di Configni"
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
        />
        {/* subtle darkening at edges for control contrast */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top controls */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            type="button"
            aria-label="Apri il menu"
            className="flex size-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm ring-1 ring-white/15 transition-transform active:scale-90 hover:bg-black/50"
          >
            <Menu className="size-6" />
          </button>

          <button
            type="button"
            aria-label="Notifiche, 3 nuove"
            className="relative flex size-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm ring-1 ring-white/15 transition-transform active:scale-90 hover:bg-black/50"
          >
            <Bell className="size-6" />
            <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white ring-2 ring-background">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
