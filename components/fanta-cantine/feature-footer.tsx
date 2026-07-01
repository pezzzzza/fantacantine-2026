import { Music, Trophy, Users, Wine } from 'lucide-react'

const features = [
  { Icon: Trophy, label: 'Sfida i tuoi amici e vinci' },
  { Icon: Wine, label: 'Partecipa alla festa' },
  { Icon: Music, label: 'Guadagna bonus e badge' },
  { Icon: Users, label: 'Scala le classifiche' },
]

export function FeatureFooter() {
  return (
    <ul className="grid grid-cols-4 gap-2">
      {features.map(({ Icon, label }, i) => (
        <li
          key={label}
          className={`flex flex-col items-center gap-2 px-1 text-center ${
            i > 0 ? 'border-l border-gold/25' : ''
          }`}
        >
          <Icon className="size-7 text-gold" aria-hidden="true" />
          <span className="font-heading text-[0.6rem] font-bold uppercase leading-tight tracking-wide text-parchment/90">
            {label}
          </span>
        </li>
      ))}
    </ul>
  )
}
