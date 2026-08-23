'use client'

import { Menu, PawPrint, X } from 'lucide-react'
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

  return (
    <header className="border-b border-foreground/10 py-5">
      <div className="flex items-center justify-between">
        <a href="/" className={`flex items-center gap-2 font-semibold tracking-tight transition-all duration-500 ease-out ${showBrand ? 'translate-y-0 opacity-100 blur-0' : 'pointer-events-none -translate-y-1 opacity-0 blur-[1px]'}`}>
          {logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>}
          <span className="transition-opacity duration-500">{appName.toLowerCase()}</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/catalogo" className="transition-colors hover:text-foreground">Catálogo</a>
          <a href="/reconocimiento" className="transition-colors hover:text-foreground">Agradecimientos</a>
          <a href="/donar" className="transition-colors hover:text-foreground">Donativos</a>
          <a href="/eventos" className="transition-colors hover:text-foreground">Eventos</a>
        </nav>
        <a href="/#formulario" className="hidden rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground sm:block">Quiero adoptar</a>
        <button type="button" aria-label="Abrir menú" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <nav className="flex flex-col gap-4 pt-5 text-sm md:hidden"><a href="/catalogo" onClick={closeMenu}>Catálogo</a><a href="/reconocimiento" onClick={closeMenu}>Gracias</a><a href="/#donativos" onClick={closeMenu}>Donativos</a><a href="/eventos" onClick={closeMenu}>Eventos</a><a href="/#formulario" onClick={closeMenu}>Quiero adoptar</a></nav>}
    </header>
  )
}
