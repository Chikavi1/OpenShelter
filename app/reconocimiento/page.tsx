'use client'

import { ArrowRight, Heart, Quote } from 'lucide-react'
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

        <section className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Muro de reconocimiento</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-7xl">Las historias cambian cuando alguien decide <span className="text-muted-foreground">estar presente.</span></h1>
          </div>
          <div className="max-w-md lg:pb-2"><p className="text-lg leading-8 text-muted-foreground">Cada donante, padrino, empresa aliada y voluntario convierte una ayuda en alimento, atención médica y una nueva oportunidad.</p><a href="/donar" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Quiero apoyar <ArrowRight className="size-4" /></a></div>
        </section>

        <section className="border-t border-foreground/10 py-16 sm:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Gracias a ustedes</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Personas que dejan huella</h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">Ellos hacen posible que el refugio siga cuidando, rehabilitando y conectando vidas.</p></div>
          {publicThanks.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
              {publicThanks.map((thank, index) => {
                const span = index % 4 === 0 || index % 4 === 3 ? 'lg:col-span-5' : 'lg:col-span-7'
                return <article key={thank.id || thank.name} className={`group flex min-h-[250px] flex-col justify-between rounded-[2rem] border border-white/80 bg-card p-6 shadow-[0_18px_55px_-30px_rgba(23,37,84,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_-28px_rgba(23,37,84,0.5)] sm:p-7 ${span}`}>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={thank.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} alt={thank.name} className="size-12 rounded-full border-4 border-background object-cover shadow-sm" />
                        <div className="min-w-0"><h3 className="truncate text-base font-semibold tracking-tight">{thank.name}</h3><p className="mt-1 text-xs text-muted-foreground">{thank.role}</p></div>
                      </div>
                      <span className="text-lg leading-none text-muted-foreground/60">•••</span>
                    </div>
                    {thank.amountOrContribution && <div className="mt-7 rounded-2xl border border-foreground/5 bg-background/75 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Aportación</p><p className="mt-2 text-sm font-medium leading-6">{thank.amountOrContribution}</p><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-400" /> Reconocimiento público</p></div>}
                  </div>
                  <div className="mt-7 flex gap-3 border-t border-foreground/10 pt-5"><Quote className="mt-1 size-4 shrink-0 text-primary/60" /><p className="text-sm italic leading-6 text-muted-foreground">{thank.message || 'Gracias por ser parte de esta causa.'}</p></div>
                </article>
              })}
            </div>
          ) : <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-card p-14 text-center text-muted-foreground">Pronto compartiremos a las personas que hacen posible nuestra labor.</div>}
        </section>

        <section className="rounded-[2rem] bg-secondary p-7 sm:p-10 lg:p-12"><div className="mb-8 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-background text-primary"><Heart className="size-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">El impacto de sumar esfuerzos</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Lo que construimos juntos</h2></div></div><div className="grid gap-8 border-t border-foreground/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">{impact.map((item) => <div key={item.label}><p className="text-5xl font-semibold tracking-[-0.07em]">{item.value}</p><p className="mt-2 text-sm text-muted-foreground">{item.label}</p></div>)}</div></section>

        <section className="my-16 rounded-[2rem] bg-primary p-7 text-primary-foreground sm:my-20 sm:p-12"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">¿Quieres ser parte?</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Tu generosidad puede ser la próxima historia.</h2></div><a href="/donar" className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Hacer un donativo <ArrowRight className="size-4" /></a></div></section>

    </PublicPageShell>
  )
}
