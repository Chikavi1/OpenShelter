'use client'

import { ArrowRight, Check, Heart, Home, PawPrint, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { DEFAULT_DASHBOARD_STATE } from '@/lib/dashboard-defaults'

const VALUE_ICONS = [ShieldCheck, Home, Users, Heart] as const
const STEP_ICONS = [PawPrint, Stethoscope, Home, ShieldCheck] as const

export default function NosotrosPage() {
  const site = usePublicSite()
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || 'Refugio'
  const about = (site.settings as any).aboutContent ?? (DEFAULT_DASHBOARD_STATE.settings as any).aboutContent
  const adopted = site.pets.filter((p) => p.status === 'Adoptado').length
  const active = site.pets.filter((p) => p.status !== 'Adoptado').length

  // fallbacks
  const heroKicker = about?.heroKicker ?? 'Quiénes somos'
  const heroTitle = about?.heroTitle ?? 'No salvamos mascotas.'
  const heroHighlight = about?.heroHighlight ?? 'Salvamos futuros.'
  const heroDescription = about?.heroDescription ?? site.settings.description
  const storyImageUrl = about?.storyImageUrl ?? 'https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop'
  const storyKicker = about?.storyKicker ?? 'Nuestra historia'
  const storyTitle = about?.storyTitle ?? 'De un rescate a una red de apoyo'
  const storyParagraphs: string[] = about?.storyParagraphs ?? [
    'Empezamos rescatando a uno. Hoy somos una comunidad de voluntarios, veterinarios, hogares temporales y familias que han decidido que ningún animal se quede atrás.',
    'Trabajamos en CDMX y colaboramos con hogares temporales en toda la zona metropolitana.',
  ]
  const valuesKicker = about?.valuesKicker ?? 'Lo que nos mueve'
  const valuesTitle = about?.valuesTitle ?? 'Nuestros valores'
  const valuesDesc = about?.valuesDesc ?? 'No somos un albergue masivo. Somos una red pequeña que hace las cosas con cuidado.'
  const values: Array<{ title: string; desc: string }> = about?.values ?? []
  const stepsKicker = about?.stepsKicker ?? 'Cómo trabajamos'
  const stepsTitle = about?.stepsTitle ?? 'Del rescate al hogar'
  const stepsDesc = about?.stepsDesc ?? 'Un proceso claro, humano y con seguimiento.'
  const steps: Array<{ n: string; title: string; desc: string }> = about?.steps ?? []
  const ctaKicker = about?.ctaKicker ?? 'Súmate'
  const ctaTitle = about?.ctaTitle ?? 'Hay muchas formas de ayudar, incluso si no puedes adoptar ahora.'
  const ctaDesc = about?.ctaDesc ?? 'Dona, ofrece hogar temporal, comparte un perfil o visítanos.'

  return (
    <PublicPageShell appName={appName} logoUrl={site.settings.logoUrl} contentClassName="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">

      <section className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> {heroKicker}</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-7xl">{heroTitle} <span className="text-muted-foreground">{heroHighlight}</span></h1>
        </div>
        <div className="max-w-md lg:pb-2">
          <p className="text-lg leading-8 text-muted-foreground">{heroDescription}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Conocer rescatados <ArrowRight className="size-4" /></a>
            <a href="/donar" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium transition hover:bg-muted">Apoyar al refugio</a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] bg-secondary">
          <img src={storyImageUrl} alt={storyTitle} className="h-[420px] w-full object-cover sm:h-[480px]" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-foreground/10 bg-card p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{storyKicker}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{storyTitle}</h2>
            {storyParagraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-7 text-muted-foreground">{p}</p>
            ))}
            {(site.settings.address || site.settings.city) && (
              <p className="mt-6 flex items-center gap-2 text-sm font-medium"><span className="grid size-7 place-items-center rounded-full bg-accent"><Check className="size-4" /></span>{site.settings.address}{site.settings.city ? `, ${site.settings.city}` : ''}</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-primary p-5 text-primary-foreground"><p className="text-3xl font-semibold tracking-tight">{site.pets.length}</p><p className="mt-1 text-xs leading-4 opacity-70">rescatados registrados</p></div>
            <div className="rounded-2xl bg-accent p-5 text-accent-foreground"><p className="text-3xl font-semibold tracking-tight">{adopted}</p><p className="mt-1 text-xs leading-4 opacity-70">adopciones felices</p></div>
            <div className="rounded-2xl border border-foreground/10 bg-card p-5"><p className="text-3xl font-semibold tracking-tight">{active}</p><p className="mt-1 text-xs leading-4 text-muted-foreground">en cuidado activo</p></div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{valuesKicker}</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{valuesTitle}</h2></div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{valuesDesc}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, idx) => {
            const Icon = VALUE_ICONS[idx % VALUE_ICONS.length]
            return (
              <div key={v.title + idx} className="rounded-[1.75rem] border border-foreground/10 bg-card p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><Icon className="size-5" /></span>
                <h3 className="mt-5 text-base font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-[2rem] bg-secondary p-7 sm:p-10 lg:p-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{stepsKicker}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{stepsTitle}</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">{stepsDesc}</p></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length]
            return (
              <div key={s.n + s.title} className="relative overflow-hidden rounded-[1.75rem] bg-card p-6">
                <span className="text-xs font-bold tracking-widest text-muted-foreground/60">{s.n}</span>
                <h3 className="mt-3 flex items-center gap-2 text-base font-semibold"><Icon className="size-4 text-primary" />{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="my-16 grid gap-6 rounded-[2rem] bg-primary p-7 text-primary-foreground sm:my-20 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">{ctaKicker}</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{ctaTitle}</h2></div>
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-primary-foreground/70">{ctaDesc}</p>
          <div className="flex flex-wrap gap-3">
            <a href="/donar" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Donar ahora <ArrowRight className="size-4" /></a>
            <a href="/contacto" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/10">Ser voluntario</a>
          </div>
        </div>
      </section>

    </PublicPageShell>
  )
}
