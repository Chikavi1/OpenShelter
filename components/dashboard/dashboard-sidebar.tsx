'use client'

import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'

const DEFAULT_IMAGE_URL = 'https://i.ibb.co/tFjxBQK/default-image-icon-4595376-512.png'
const navigation = [
  { id: 'overview', label: 'Resumen general', icon: Icons.LayoutDashboard },
  { id: 'pets', label: 'Listado de mascotas', icon: Icons.PawPrint },
  { id: 'applications', label: 'Solicitudes', icon: Icons.FileText },
  { id: 'foster-homes', label: 'Casas puente', icon: Icons.Home },
  { id: 'thanks', label: 'Agradecimientos', icon: Icons.Gift },
  { id: 'adoption-followups', label: 'Seguimiento de adopciones', icon: Icons.HeartHandshake },
  { id: 'contracts', label: 'Contratos', icon: Icons.ScrollText },
  { id: 'events', label: 'Eventos', icon: Icons.CalendarDays },
] as const

function BrandMark({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/15 text-primary ${className}`}><img src={src || DEFAULT_IMAGE_URL} alt={alt} className="h-full w-full object-cover" /></span>
}

export function DashboardSidebar() {
  const { settings, mobileMenuOpen, setMobileMenuOpen, handleLogout, activeTab, setActiveTab } = useDashboardContext()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const close = () => setMobileMenuOpen(false)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return <>
    <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-foreground/10 bg-card/95 px-4 py-3 shadow-sm backdrop-blur-md md:hidden">
      <Link href="/" onClick={close} className="flex min-w-0 items-center gap-3"><BrandMark src={settings.logoUrl} alt={settings.name} className="size-9" /><div className="min-w-0"><p className="truncate text-sm font-bold">{settings.name}</p><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Panel admin</p></div></Link>
      <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="grid size-10 place-items-center rounded-xl border border-foreground/10 bg-background transition hover:bg-secondary">{mobileMenuOpen ? <Icons.X className="size-5" /> : <Icons.Menu className="size-5" />}</button>
    </header>
    {mobileMenuOpen && <button type="button" aria-label="Cerrar menú" onClick={close} className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[2px] md:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-foreground/10 bg-card px-4 py-5 shadow-xl transition-transform duration-300 md:sticky md:top-0 md:w-72 md:translate-x-0 md:shadow-none ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between border-b border-foreground/10 px-2 pb-5"><Link href="/" onClick={close} className="flex min-w-0 items-center gap-3"><BrandMark src={settings.logoUrl} alt={settings.name} className="size-10 rounded-2xl" /><div className="min-w-0"><p className="truncate text-base font-bold tracking-tight">{settings.name}</p><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Panel admin</p></div></Link><button type="button" onClick={close} aria-label="Cerrar menú" className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden"><Icons.X className="size-5" /></button></div>
      <nav className="mt-6 flex-1 space-y-1" aria-label="Navegación del panel"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Administración</p>{navigation.map(({ id, label, icon: Icon }) => { const selected = activeTab === id || (id === 'events' && activeTab === 'register-event'); return <button key={id} type="button" onClick={() => { setActiveTab(id); close() }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${selected ? 'bg-primary/15 font-semibold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><span className={`grid size-8 place-items-center rounded-lg transition ${selected ? 'bg-primary text-primary-foreground' : 'bg-transparent group-hover:bg-background'}`}><Icon className="size-[17px]" /></span><span className="leading-5">{label}</span>{selected && <span className="ml-auto size-1.5 rounded-full bg-primary" />}</button> })}</nav>
      <div className="border-t border-foreground/10 pt-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('settings')
            close()
          }}
          className={`mb-4 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${activeTab === 'settings' ? 'bg-primary/15 font-semibold text-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
        >
          <span className={`grid size-8 place-items-center rounded-lg transition ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}>
            <Icons.Settings className="size-[17px]" />
          </span>
          <span className="leading-5">Configuración</span>
          {activeTab === 'settings' && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
        </button>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            className="flex w-full items-center gap-3 rounded-2xl bg-secondary/50 p-3 text-left transition hover:bg-secondary"
          >
            <BrandMark src={settings.logoUrl} alt={settings.name} className="size-10 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{settings.name}</p>
              <p className="truncate text-xs text-muted-foreground">{settings.email}</p>
            </div>
            <Icons.ChevronUp className={`size-4 text-muted-foreground transition ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-lg">
              <Link href="/" onClick={close} className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                <Icons.ExternalLink className="size-4" />
                Volver al home
              </Link>
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50">
                <Icons.LogOut className="size-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  </>
}
