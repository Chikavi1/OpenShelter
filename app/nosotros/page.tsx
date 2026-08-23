'use client'

import { ArrowRight, Check, Heart, Home, PawPrint, ShieldCheck, Stethoscope, Users } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'

const VALUES = [
  { title: 'Rescate con respeto', desc: 'Cada intervención prioriza el bienestar del animal, sin violencia y con acompañamiento veterinario.', icon: ShieldCheck },
  { title: 'Adopción responsable', desc: 'Evaluamos compatibilidad, damos seguimiento y acompañamos a la familia después de la entrega.', icon: Home },
  { title: 'Transparencia total', desc: 'Cada donativo se reporta y cada historia se comparte. Nada se esconde.', icon: Users },
  { title: 'Comunidad que acompaña', desc: 'Voluntarios, hogares temporales y padrinos hacen posible lo que solos no podríamos.', icon: Heart },
]

const STEPS = [
  { n: '01', title: 'Rescate', desc: 'Rescatamos reportes de abandono, maltrato o extravío y damos atención inmediata.', icon: PawPrint },
  { n: '02', title: 'Rehabilitación', desc: 'Atención veterinaria, esterilización, vacunas, desparasitación y terapia conductual si hace falta.', icon: Stethoscope },
  { n: '03', title: 'Hogar temporal', desc: 'Los rescatados conviven en hogares temporales donde recuperan confianza y rutina.', icon: Home },
  { n: '04', title: 'Adopción y seguimiento', desc: 'Conectamos con la familia ideal y damos seguimiento post-adopción con visitas y apoyo.', icon: ShieldCheck },
]

export default function NosotrosPage() {
  const site = usePublicSite()
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || 'Refugio'
  const description = site.settings.description || 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con familias amorosas.'
  const adopted = site.pets.filter((p) => p.status === 'Adoptado').length
  const active = site.pets.filter((p) => p.status !== 'Adoptado').length

  return (
    <PublicPageShell appName={appName} logoUrl={site.settings.logoUrl} contentClassName="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">

      <section className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Quiénes somos</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] sm:text-7xl">No salvamos mascotas. <span className="text-muted-foreground">Salvamos futuros.</span></h1>
        </div>
        <div className="max-w-md lg:pb-2">
          <p className="text-lg leading-8 text-muted-foreground">{description} Nacimos de un grupo de vecinos que decidió no mirar hacia otro lado.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Conocer rescatados <ArrowRight className="size-4" /></a>
            <a href="/donar" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium transition hover:bg-muted">Apoyar al refugio</a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] bg-secondary">
          <img src="https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop" alt="Voluntaria cuidando perros rescatados" className="h-[420px] w-full object-cover sm:h-[480px]" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-foreground/10 bg-card p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nuestra historia</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">De un rescate a una red de apoyo</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Empezamos rescatando a uno. Hoy somos una comunidad de voluntarios, veterinarios, hogares temporales y familias que han decidido que ningún animal se quede atrás. Cada caso nos enseña que con cuidado, paciencia y compromiso, una vida puede cambiar por completo.</p>
            <p className="mt-4 leading-7 text-muted-foreground">Trabajamos en CDMX y colaboramos con hogares temporales en toda la zona metropolitana. Todo lo que hacemos se sostiene con donativos y trabajo voluntario.</p>
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
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Lo que nos mueve</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">Nuestros valores</h2></div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">No somos un albergue masivo. Somos una red pequeña que hace las cosas con cuidado, para que cada adopción dure para siempre.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-[1.75rem] border border-foreground/10 bg-card p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground"><v.icon className="size-5" /></span>
              <h3 className="mt-5 text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-secondary p-7 sm:p-10 lg:p-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cómo trabajamos</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Del rescate al hogar</h2></div><p className="max-w-md text-sm leading-6 text-muted-foreground">Un proceso claro, humano y con seguimiento. No entregamos mascotas a la ligera.</p></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative overflow-hidden rounded-[1.75rem] bg-card p-6">
              <span className="text-xs font-bold tracking-widest text-muted-foreground/60">{s.n}</span>
              <h3 className="mt-3 flex items-center gap-2 text-base font-semibold"><s.icon className="size-4 text-primary" />{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-16 grid gap-6 rounded-[2rem] bg-primary p-7 text-primary-foreground sm:my-20 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Súmate</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Hay muchas formas de ayudar, incluso si no puedes adoptar ahora.</h2></div>
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-primary-foreground/70">Dona, ofrece hogar temporal, comparte un perfil o visítanos. Cada gesto cuenta y lo agradecemos de corazón.</p>
          <div className="flex flex-wrap gap-3">
            <a href="/donar" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Donar ahora <ArrowRight className="size-4" /></a>
            <a href="/contacto" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/10">Ser voluntario</a>
          </div>
        </div>
      </section>

    </PublicPageShell>
  )
}
