'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    soprannome: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!privacyAccepted) {
      setError('Devi accettare la Privacy Policy e i Termini e Condizioni')
      return
    }

    setLoading(true)
    setError('')

    // 1. Registra su Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Errore durante la registrazione')
      setLoading(false)
      return
    }

    // 2. Salva i dati nella tabella utenti
    const { error: dbError } = await supabase
      .from('utenti')
      .insert({
        id: authData.user.id,
        email: form.email,
        nome: form.nome,
        cognome: form.cognome,
        soprannome: form.soprannome || null,
        confermato: false
      })

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    // 3. Vai alla home
    router.push('/home')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bordeaux-deep px-4 py-8">
      <div className="max-w-md w-full bg-parchment rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-bordeaux">🍷 Fantacantine</h1>
          <p className="text-wood mt-2">Crea il tuo account</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-bordeaux-dark mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full px-4 py-2 border border-wood/30 rounded-lg bg-parchment/70 text-bordeaux-dark placeholder:text-wood/50 focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Mario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-bordeaux-dark mb-1">Cognome</label>
              <input
                type="text"
                value={form.cognome}
                onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                className="w-full px-4 py-2 border border-wood/30 rounded-lg bg-parchment/70 text-bordeaux-dark placeholder:text-wood/50 focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="Rossi"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-bordeaux-dark mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-wood/30 rounded-lg bg-parchment/70 text-bordeaux-dark placeholder:text-wood/50 focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="tu@email.it"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-bordeaux-dark mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-wood/30 rounded-lg bg-parchment/70 text-bordeaux-dark placeholder:text-wood/50 focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-wood/60 mt-1">Minimo 6 caratteri</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-bordeaux-dark mb-1">
              Soprannome <span className="text-wood/60 text-xs">(opzionale)</span>
            </label>
            <input
              type="text"
              value={form.soprannome}
              onChange={(e) => setForm({ ...form, soprannome: e.target.value })}
              className="w-full px-4 py-2 border border-wood/30 rounded-lg bg-parchment/70 text-bordeaux-dark placeholder:text-wood/50 focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Come vuoi essere chiamato"
            />
            <p className="text-xs text-wood/60 mt-1">Il soprannome sarà il tuo nome pubblico</p>
          </div>

          <div className="mb-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                required
                className="mt-1 w-4 h-4 accent-gold"
              />
              <span className="text-xs text-bordeaux-dark">
                Ho letto e accetto la{' '}
                <Link href="/privacy" className="text-gold hover:underline" target="_blank">
                  Privacy Policy
                </Link>
                {' '}e i{' '}
                <Link href="/terms" className="text-gold hover:underline" target="_blank">
                  Termini e Condizioni
                </Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-bordeaux to-bordeaux-dark text-parchment py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 border-2 border-gold/40"
          >
            {loading ? '⏳ Caricamento...' : 'REGISTRATI'}
          </button>
        </form>

        <p className="text-center text-sm text-wood mt-6">
          Hai già un account?{' '}
          <Link href="/" className="text-gold hover:underline font-bold">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  )
}
