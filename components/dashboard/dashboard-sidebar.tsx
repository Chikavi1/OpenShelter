'use client'

import * as Icons from 'lucide-react'
import Link from 'next/link'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'

const DEFAULT_IMAGE_URL = 'https://i.ibb.co/tFjxBQK/default-image-icon-4595376-512.png'

function BrandMark({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <span className={`grid overflow-hidden place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm ${className}`}><img src={src || DEFAULT_IMAGE_URL} alt={alt} className="h-full w-full object-cover" /></span>
}

export function DashboardSidebar() {
  const { settings, mobileMenuOpen, setMobileMenuOpen, handleLogout, activeTab, setActiveTab, handleStartCreatePet } = useDashboardContext()

  return (<>
  {/* Mobile Top Header */}
  <header className="md:hidden sticky top-0 z-40 w-full border-b border-foreground/10 bg-card/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-xs">
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-base">
              <BrandMark src={settings.logoUrl} alt={settings.name} className="size-8" />
      <div className="flex flex-col">
        <span className="leading-tight font-bold truncate max-w-[150px]">{settings.name}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Panel Admin</span>
      </div>
    </Link>

    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      aria-label="Abrir menú"
      className="p-2 rounded-xl border border-foreground/15 bg-background text-foreground hover:bg-secondary transition active:scale-95"
    >
      {mobileMenuOpen ? <Icons.X className="size-5" /> : <Icons.Menu className="size-5" />}
    </button>
  </header>

  {/* Backdrop for Mobile Overlay */}
  {mobileMenuOpen && (
    <div
      onClick={() => setMobileMenuOpen(false)}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in"
    />
  )}

  {/* Sidebar Navigation */}
  <aside
    className={`fixed inset-y-0 left-0 z-50 h-screen max-h-screen w-72 overflow-y-auto border-r border-foreground/10 bg-card/95 p-5 backdrop-blur-md flex shrink-0 flex-col justify-between transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:w-64 md:transform-none ${
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}
  >
    <div>
      {/* Logo / Brand Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/10">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 font-semibold tracking-tight text-lg"
        >
              <BrandMark src={settings.logoUrl} alt={settings.name} className="size-9" />
          <div className="flex flex-col">
            <span className="leading-tight font-bold truncate max-w-[140px]">{settings.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Panel Admin</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <Icons.X className="size-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="space-y-1.5">
        <button
          onClick={() => {
            setActiveTab('overview')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.TrendingUp className="size-4" />
          Resumen General
        </button>

        <button
          onClick={() => {
            setActiveTab('pets')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'pets'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.List className="size-4" />
          Listado de Mascotas
        </button>

        <button
          onClick={() => {
            setActiveTab('applications')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'applications'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.FileText className="size-4" />
          Solicitudes
        </button>

        {/* NAV: Casas Puente */}
        <button
          onClick={() => {
            setActiveTab('foster-homes')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'foster-homes'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.Home className="size-4" />
          Casas Puente
        </button>

        {/* NAV: Agradecimientos */}
        <button
          onClick={() => {
            setActiveTab('thanks')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'thanks'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.Gift className="size-4" />
          Agradecimientos
        </button>

        <button
          onClick={() => {
            setActiveTab('adoption-followups')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'adoption-followups'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.HeartHandshake className="size-4" />
          Seguimiento de Adopciones
        </button>

        <button
          onClick={() => {
            setActiveTab('events')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'events'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.CalendarDays className="size-4" />
          Eventos
        </button>

        <button
          onClick={() => {
            setActiveTab('settings')
            setMobileMenuOpen(false)
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <Icons.Settings className="size-4" />
          Configuración Refugio
        </button>
      </nav>
    </div>

    {/* User Info / Footer in sidebar */}
    <div className="pt-5 border-t border-foreground/10 mt-6">
      <div className="flex items-center gap-3 px-2 py-1">
          <BrandMark src={settings.logoUrl} alt={settings.name} className="size-9" />
        <div className="flex flex-col truncate">
          <span className="text-sm font-semibold truncate">{settings.name}</span>
          <span className="text-xs text-muted-foreground truncate">{settings.email}</span>
        </div>
      </div>
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
        className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 transition"
      >
        <Icons.LogOut className="size-3.5" />
        Volver a la web pública
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 transition"
      >
        <Icons.Lock className="size-3.5" />
        Cerrar sesión
      </button>
    </div>
  </aside>
  </>)
}
