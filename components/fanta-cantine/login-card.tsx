'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, Crown, Eye, EyeOff, Grape, LogIn, Lock, Star, User } from 'lucide-react'
import { SocialButtons } from './social-buttons'

export function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setMessage(`❌ ${error.message}`)
      setSubmitting(false)
    } else {
      router.push('/home')
    }
  }

  return (
    <div className="animate-float-up rounded-[1.75rem] border-2 border-gold/40 bg-parchment-texture p-6 shadow-2xl shadow-black/50 sm:p-7">
      {/* Crest */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-0.5 text-gold" aria-hidden="true">
          <Star className="size-2.5 fill-gold" />
          <Crown className="size-4 fill-gold" />
          <Star className="size-2.5 fill-gold" />
        </div>
        <div className="drop-shadow-vintage -mt-1 flex size-14 items-center justify-center rounded-b-[1.4rem] rounded-t-md border-2 border-gold bg-gradient-to-b from-bordeaux to-bordeaux-dark [clip-path:polygon(0_0,100%_0,100%_65%,50%_100%,0_65%)]">
          <Grape className="size-7 text-gold" aria-label="Stemma Fanta Cantine" />
        </div>
      </div>

      {/* Heading */}
      <div className="mt-3 text-center">
        <h2 className="font-script text-5xl font-bold text-bordeaux">
          Bentornato!
        </h2>
        <p className="mt-1 font-sans text-sm text-wood">
          Accedi al tuo account e vivi la festa.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-wood/30 bg-parchment/70 px-4 py-3 transition-colors focus-within:border-gold">
            <User className="size-5 shrink-0 text-wood" aria-hidden="true" />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent text-bordeaux-dark placeholder:text-wood/60 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-wood/30 bg-parchment/70 px-4 py-3 transition-colors focus-within:border-gold">
            <Lock className="size-5 shrink-0 text-wood" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-bordeaux-dark placeholder:text-wood/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="shrink-0 rounded-full p-1 text-wood transition-colors hover:text-bordeaux focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
            >
              {showPassword ? (
                <EyeOff className="size-5" aria-hidden="true" />
              ) : (
                <Eye className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="-mt-1 text-right">
          <a
            href="#"
            className="font-heading text-xs font-bold text-bordeaux transition-colors hover:text-gold"
          >
            Password dimenticata?
          </a>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group mt-1 flex items-center justify-center gap-3 rounded-xl border-2 border-gold bg-gradient-to-b from-bordeaux to-bordeaux-dark px-6 py-3.5 shadow-lg shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogIn
            className="size-5 text-gold transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          <span className="font-heading text-lg font-bold tracking-[0.15em] text-parchment">
            {submitting ? 'ACCESSO...' : 'ACCEDI'}
          </span>
        </button>

        {message && (
          <p
            role="status"
            className="rounded-lg border border-gold/40 bg-parchment/60 px-3 py-2 text-center text-sm text-bordeaux-dark"
          >
            {message}
          </p>
        )}
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-wood/25" />
        <span className="font-heading text-xs font-semibold uppercase tracking-widest text-wood">
          oppure
        </span>
        <span className="h-px flex-1 bg-wood/25" />
      </div>

      <SocialButtons
        onSelect={(provider) =>
          setMessage(`Accesso con ${provider} non ancora configurato.`)
        }
      />

      {/* Register - LINK MODIFICATO */}
      <div className="mt-6 text-center">
        <p className="font-sans text-sm font-medium text-wood">
          Non hai ancora un account?
        </p>
        <Link
          href="/register"
          className="mt-1 inline-flex items-center gap-1.5 font-heading text-base font-bold tracking-wide text-bordeaux transition-colors hover:text-gold"
        >
          REGISTRATI ORA
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
