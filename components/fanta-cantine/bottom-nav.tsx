'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'  // 👈 AGGIUNGI
import { Home, Trophy, Users, User, Wine } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { id: "home", label: "Home", Icon: Home, path: "/dashboard" },
  { id: "classifiche", label: "Classifiche", Icon: Trophy, path: "/classifica" },
  { id: "squadra", label: "Squadra", Icon: Users, path: "/squadra" },
  { id: "profilo", label: "Profilo", Icon: User, path: "/profilo" },
]

export function BottomNav() {
  const [active, setActive] = useState("home")
  const router = useRouter()  // 👈 AGGIUNGI

  const handleNavigate = (id: string, path: string) => {
    setActive(id)
    router.push(path)
  }

  return (
    <nav className="sticky bottom-0 z-20 -mx-4 mt-2">
      <div className="relative flex items-end justify-between rounded-t-3xl border-t border-white/10 bg-primary px-4 pb-5 pt-3 text-primary-foreground shadow-[0_-8px_24px_rgba(0,0,0,0.35)]">
        {/* left pair */}
        <div className="flex flex-1 justify-around">
          {items.slice(0, 2).map(({ id, label, Icon, path }) => (
            <NavButton
              key={id}
              label={label}
              Icon={Icon}
              active={active === id}
              onClick={() => handleNavigate(id, path)}
            />
          ))}
        </div>

        {/* center elevated button */}
        <div className="relative flex w-16 shrink-0 justify-center">
          <button
            type="button"
            aria-label="Azione principale"
            onClick={() => handleNavigate("wine", "/dashboard")}
            className={cn(
              "absolute -top-9 flex size-16 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-lg ring-4 ring-background transition-transform active:scale-90 hover:brightness-105",
              active === "wine" && "scale-105",
            )}
          >
            <Wine className="size-8" />
          </button>
        </div>

        {/* right pair */}
        <div className="flex flex-1 justify-around">
          {items.slice(2).map(({ id, label, Icon, path }) => (
            <NavButton
              key={id}
              label={label}
              Icon={Icon}
              active={active === id}
              onClick={() => handleNavigate(id, path)}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

function NavButton({
  label,
  Icon,
  active,
  onClick,
}: {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors",
        active ? "text-gold" : "text-primary-foreground/70 hover:text-primary-foreground",
      )}
    >
      <Icon className="size-6" />
      {label}
    </button>
  )
}
