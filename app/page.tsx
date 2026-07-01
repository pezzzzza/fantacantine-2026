import { FeatureFooter } from '@/components/fanta-cantine/feature-footer'
import { Logo } from '@/components/fanta-cantine/logo'
import { LoginCard } from '@/components/fanta-cantine/login-card'

// A few twinkling stars scattered over the night sky.
const stars = [
  { top: '6%', left: '12%', delay: '0s' },
  { top: '10%', left: '78%', delay: '0.6s' },
  { top: '4%', left: '46%', delay: '1.2s' },
  { top: '16%', left: '28%', delay: '0.3s' },
  { top: '14%', left: '90%', delay: '0.9s' },
  { top: '20%', left: '64%', delay: '1.5s' },
]

export default function Page() {
  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-bordeaux-deep">
      <div className="relative mx-auto min-h-dvh w-full max-w-md">
        {/* Festival night scene */}
        <div className="relative h-[38vh] max-h-[420px] min-h-[280px] w-full">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: "url('/images/festival-hero.png')" }}
            aria-hidden="true"
          />
          {/* Twinkling stars */}
          {stars.map((s, i) => (
            <span
              key={i}
              className="animate-twinkle absolute size-1 rounded-full bg-gold-light shadow-[0_0_6px_2px_rgba(232,194,106,0.6)]"
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
              aria-hidden="true"
            />
          ))}
          {/* Fade into the bordeaux body */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-bordeaux-deep" />
        </div>

        {/* Logo pulled up over the scene fade */}
        <div className="relative -mt-24 px-6">
          <div className="animate-swing">
            <Logo />
          </div>
        </div>

        {/* Login card */}
        <div className="relative mt-6 px-4">
          <LoginCard />
        </div>

        {/* Feature footer */}
        <div className="relative mt-8 px-6">
          <FeatureFooter />
        </div>

        {/* Village silhouette + tagline */}
        <footer className="relative mt-8">
          <div
            className="h-16 w-full bg-contain bg-bottom bg-repeat-x opacity-90"
            style={{ backgroundImage: "url('/images/village-silhouette.png')" }}
            aria-hidden="true"
          />
          <div className="bg-bordeaux-deep pb-8 pt-2 text-center">
            <p className="font-script text-2xl text-gold text-glow-gold">
              Vivi la festa. Gioca. Vinci. Divertiti!
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
