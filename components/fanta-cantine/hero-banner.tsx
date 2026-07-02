import Image from "next/image"
import { Menu, Bell } from "lucide-react"

interface HeroBannerProps {
  notifiche?: number
}

export function HeroBanner({ notifiche = 0 }: HeroBannerProps) {
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

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
            aria-label={`Notifiche${notifiche > 0 ? `, ${notifiche} nuove` : ''}`}
            className="relative flex size-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm ring-1 ring-white/15 transition-transform active:scale-90 hover:bg-black/50"
          >
            <Bell className="size-6" />
            {notifiche > 0 && (
              <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white ring-2 ring-background">
                {notifiche > 9 ? '9+' : notifiche}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
