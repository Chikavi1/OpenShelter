'use client'

import { ArrowRight, Heart, Info, LayoutGrid, Menu, PawPrint, Gift, CalendarDays, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PublicHeaderProps {
  appName: string
  logoUrl?: string
  loading?: boolean
}

export function PublicHeader({ appName, logoUrl, loading = false }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showBrand, setShowBrand] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (loading) {
      setShowBrand(false)
      return
    }
    const frame = requestAnimationFrame(() => setShowBrand(true))
    return () => cancelAnimationFrame(frame)
  }, [loading, appName, logoUrl])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  return (
    <header className="border-b border-foreground/10 py-5">
      <div className="flex items-center justify-between">
        <a href="/" className={`flex items-center gap-2 font-semibold tracking-tight transition-all duration-500 ease-out ${showBrand ? 'translate-y-0 opacity-100 blur-0' : 'pointer-events-none -translate-y-1 opacity-0 blur-[1px]'}`}>
          {logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>}
          <span className="transition-opacity duration-500">{appName.toLowerCase()}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/nosotros" className="transition-colors hover:text-foreground">Nosotros</a>
          <a href="/catalogo" className="transition-colors hover:text-foreground">Catálogo</a>
          <a href="/reconocimiento" className="transition-colors hover:text-foreground">Agradecimientos</a>
          <a href="/donar" className="transition-colors hover:text-foreground">Donativos</a>
          <a href="/eventos" className="transition-colors hover:text-foreground">Eventos</a>
        </nav>
        <a href="/catalogo" className="hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground shadow-sm transition hover:opacity-90 sm:block">Quiero adoptar</a>
        <button type="button" aria-label="Abrir menú" aria-expanded={menuOpen} className="grid size-9 place-items-center rounded-full border border-foreground/10 bg-card text-foreground shadow-sm transition hover:bg-secondary md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Cerrar menú" onClick={closeMenu} className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px] animate-in fade-in" />
          <div className="absolute inset-x-3 top-3 animate-in slide-in-from-top-2 duration-200">
            <div className="overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-foreground/10 bg-secondary/30 px-5 py-4">
                <a href="/" onClick={closeMenu} className="flex items-center gap-2.5">
                  {logoUrl ? <img src={logoUrl} alt={appName} className="size-9 rounded-full object-cover ring-1 ring-foreground/10" /> : <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>}
                  <span className="text-[15px] font-semibold tracking-tight">{appName.toLowerCase() || 'key rescata'}</span>
                </a>
                <button type="button" aria-label="Cerrar menú" onClick={closeMenu} className="grid size-9 place-items-center rounded-full bg-foreground text-background transition hover:opacity-90">
                  <X className="size-4" />
                </button>
              </div>
              <nav className="grid gap-1 p-3">
                {[
                  { href: '/nosotros', label: 'Nosotros', icon: Info },
                  { href: '/catalogo', label: 'Catálogo', icon: LayoutGrid },
                  { href: '/reconocimiento', label: 'Agradecimientos', icon: Heart },
                  { href: '/donar', label: 'Donativos', icon: Gift },
                  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
                ].map(({ href, label, icon: Icon }) => (
                  <a key={href} href={href} onClick={closeMenu} className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium transition hover:bg-secondary active:bg-secondary">
                    <span className="grid size-8 place-items-center rounded-full bg-secondary text-foreground"><Icon className="size-4" /></span>
                    {label}
                  </a>
                ))}
              </nav>
              <div className="p-3 pt-0">
                <a href="/catalogo" onClick={closeMenu} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                  Quiero adoptar <ArrowRight className="size-4" />
                </a>
                <p className="mt-3 text-center text-xs text-muted-foreground">Rescate y adopción responsable</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
