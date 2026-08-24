'use client'

import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'

export default function ReconocimientoPage() {
  const site = usePublicSite()
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL
  const publicThanks = site.thanksList.filter((thank) => thank.isPublic)
  const impact = [
    { value: `${site.pets.filter((pet) => pet.status === 'Adoptado').length}`, label: 'adopciones felices' },
    { value: `${site.pets.length}`, label: 'historias atendidas' },
    { value: `${publicThanks.length}`, label: 'personas y aliados' },
    { value: '100%', label: 'compromiso con el rescate' },
  ]

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">

        {/* Gracias - cards como referencia (Veterinaria / Empresa) */}
        <section className="py-10 sm:py-14">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground shadow-sm"><Sparkles className="size-3.5 text-amber-500" /> Gracias a ustedes</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Personas que dejan huella</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Ellos hacen posible que el refugio siga cuidando, rehabilitando y conectando vidas. Cada gesto deja una huella eterna.</p>
          </div>
          {publicThanks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publicThanks.map((thank) => {
                const roleLabel = thank.role.toUpperCase()
                const isVoluntario = thank.role.toLowerCase().includes('volunt')
                const isEmpresa = thank.role.toLowerCase().includes('empresa')
                const tagLabel = isVoluntario ? 'VOLUNTARIO' : isEmpresa ? 'EMPRESA ALIADA' : thank.role.toUpperCase()
                const tagClass = isVoluntario ? 'bg-amber-100 text-amber-900 border-amber-200' : isEmpresa ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                const dateLabel = (thank as unknown as { date?: string }).date || 'Hoy'
                return (
                  <article
                    key={thank.id || thank.name}
                    className="flex flex-col rounded-[1.6rem] border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.12)] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={thank.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} alt={thank.name} className="size-10 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold leading-none tracking-tight">{thank.name}</h3>
                          <p className="mt-1 text-xs text-zinc-500">Miembro de honor</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-zinc-400">{dateLabel}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${tagClass}`}>{tagLabel}</span>
                    </div>
                    <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3.5">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-700"><Heart className="size-3.5 text-zinc-400" /> {thank.amountOrContribution || 'Aportación solidaria'}</p>
                    </div>
                    <p className="mt-4 text-xs italic leading-6 text-zinc-500">“{thank.message || 'Gracias por su apoyo'}”</p>
                  </article>
                )
              })}
            </div>
          ) : <div className="rounded-[1.6rem] border border-dashed border-zinc-200 bg-white p-14 text-center text-muted-foreground">Pronto compartiremos a las personas que hacen posible nuestra labor. Tu nombre puede ser el primero.</div>}
        </section>

        <section className="rounded-[1.6rem] bg-secondary p-7 sm:p-10 lg:p-12"><div className="mb-8 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-black/5"><Heart className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">El impacto de sumar esfuerzos</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Lo que construimos juntos</h2></div></div><div className="grid gap-8 border-t border-foreground/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">{impact.map((item) => <div key={item.label}><p className="text-5xl font-semibold tracking-[-0.07em]">{item.value}</p><p className="mt-2 text-sm text-muted-foreground">{item.label}</p></div>)}</div></section>

        <section className="my-10 rounded-[1.6rem] bg-zinc-900 p-7 text-white shadow-sm sm:my-14 sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center"><div><p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"><span className="size-1.5 rounded-full bg-accent" /> ¿Quieres ser parte?</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Tu generosidad puede ser la próxima historia.</h2></div><a href="/donar" className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:opacity-90">Hacer un donativo <ArrowRight className="size-4" /></a></div></section>

    </PublicPageShell>
  )
}
