'use client'

import { ArrowLeft, ArrowRight, Heart, PawPrint, Star } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'

export default function ReconocimientoPage() {
  const site = usePublicSite()
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL
  const publicThanks = site.thanksList.filter((thank) => thank.isPublic).map((thank) => ({
    id: thank.id,
    name: thank.name,
    role: thank.role,
    contribution: thank.amountOrContribution,
    msg: thank.message,
    img: thank.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  }))

  const impact = [
    { value: `${site.pets.filter((pet) => pet.status === 'Adoptado').length}`, label: 'adopciones felices' },
    { value: `${site.pets.filter((pet) => pet.status !== 'Adoptado').length}`, label: 'rescates atendidos' },
    { value: `${publicThanks.length}`, label: 'aliados y reconocimientos' },
    { value: '100%', label: 'de donativos directo al rescate' },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al inicio</a>
        </header>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Muro de Reconocimiento</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Gracias por hacer <span className="text-muted-foreground">esto posible.</span></h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Nuestra labor existe gracias a la generosidad de donantes, padrinos, empresas aliadas y voluntarios dedicados.</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-accent p-7 sm:p-12"><div className="grid gap-8 border-b border-accent-foreground/20 pb-8 sm:grid-cols-2 lg:grid-cols-4">{impact.map((item) => <div key={item.label}><p className="text-5xl font-semibold tracking-[-0.06em]">{item.value}</p><p className="mt-2 text-sm text-accent-foreground/65">{item.label}</p></div>)}</div><div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><p className="max-w-xl text-sm leading-6 text-accent-foreground/70">Cada aportación, por pequeña que sea, deja huella en la vida de una mascota rescatada.</p><a href="/donar" className="flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"><Heart className="size-4" /> Únete a la lista <ArrowRight className="size-4" /></a></div></section>

        <section className="py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Personas que dejan huella</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Este año nos acompañaron con su tiempo, su talento y su generosidad.</p>
          </div>
          {publicThanks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicThanks.map((t) => (
                <div key={t.id || t.name} className="flex flex-col justify-between space-y-4 rounded-3xl border border-foreground/10 bg-card p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={t.img} alt={t.name} className="size-12 rounded-full border border-foreground/10 object-cover" />
                      <div>
                        <h3 className="text-base font-semibold">{t.name}</h3>
                        <span className="flex items-center gap-1 text-xs font-medium text-primary"><Star className="size-3 fill-current" /> {t.role}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-secondary p-3 text-xs">
                      <span className="block text-[10px] font-bold uppercase text-muted-foreground">Aportación:</span>
                      <p className="font-medium text-foreground">{t.contribution}</p>
                    </div>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">&quot;{t.msg}&quot;</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-foreground/10 bg-card p-12 text-center text-muted-foreground">
              <p>Pronto compartiremos más reconocimientos de quienes hacen posible nuestra labor.</p>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">¿Quieres ser parte?</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Tu nombre podría aparecer aquí.</h2></div><a href="/donar" className="flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">Haz un donativo <ArrowRight className="size-4" /></a></div></section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
