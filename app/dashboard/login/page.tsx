'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Lock, Mail, PawPrint, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setError('Correo o contraseña incorrectos.')
        return
      }

      router.replace('/dashboard')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <PawPrint className="size-5" />
          </span>
          Panel
        </Link>
        <div className="w-full rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-8">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
              <Lock className="size-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">Panel del Refugio</h1>
            <p className="mt-2 text-sm text-muted-foreground">Inicia sesión para administrar el refugio.</p>
          </div>
          <form className="grid gap-5" onSubmit={handleLogin}>
            <label className="grid gap-2 text-sm font-medium">
              Correo electrónico
              <span className="flex items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@root.com"
                  className="w-full bg-transparent px-1 py-3 font-normal outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Contraseña
              <span className="flex items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3">
                <Lock className="size-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-1 py-3 font-normal outline-none transition placeholder:text-muted-foreground/60 focus:border-foreground"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>
            {error && <p className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700"><AlertCircle className="size-4 shrink-0" /> {error}</p>}
            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">
              <ShieldCheck className="size-4" /> Entrar al panel
            </button>
          </form>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Acceso restringido al equipo del refugio.</p>
      </div>
    </main>
  )
}
