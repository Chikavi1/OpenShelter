'use client'

import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Globe,
  Search,
} from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { slugify } from '@/lib/slug'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { getDonationMethods } from '@/lib/donation-methods'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1660535254205-b9f03a7b84dc?q=80&w=857&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
const RESCUE_IMAGE = 'https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function Page() {
  const site = usePublicSite()
  const [filter, setFilter] = useState('Todos')
  const [sent, setSent] = useState(false)
  const catalogPets = site.pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    slug: slugify(pet.name),
    type: pet.species,
    age: pet.age,
    breed: pet.breed,
    location: pet.location,
    image: pet.image,
    featured: pet.featured,
    size: pet.size,
    gender: pet.gender,
    personality: pet.personality,
    story: pet.story,
    status: pet.status,
    tone: pet.species === 'Perro' ? 'bg-[#dceebf]' : 'bg-[#e9dfd1]',
  }))
  const publicThanks = site.thanksList.filter((thank) => thank.isPublic).map((thank) => ({
    id: thank.id,
    name: thank.name,
    role: thank.role,
    contribution: thank.amountOrContribution,
    msg: thank.message,
    img: thank.avatarUrl,
  }))
  const featuredPet = catalogPets.find((pet) => pet.featured)
  const filteredPets = filter === 'Todos' ? catalogPets : catalogPets.filter((pet) => pet.type === filter)
  const donationMethods = getDonationMethods(site.settings)
  const hasDonationMethods = donationMethods.length > 0

  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">

        <section id="inicio" className="grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-20">
          <div className="max-w-3xl"><p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Rescate y adopción responsable</p><h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-7xl lg:text-[6.7rem]">Una segunda oportunidad <span className="text-muted-foreground">cambia dos vidas.</span></h1><p className="mt-8 max-w-xl text-lg leading-7 text-muted-foreground">Rescatamos, rehabilitamos y conectamos mascotas increíbles con personas listas para quererlas para siempre.</p><div className="mt-9 flex flex-wrap gap-3"><a href="/donar" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]">Apoyar <ArrowRight className="ml-2 inline size-4" /></a><a href="/nosotros" className="rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition hover:bg-muted">Conoce nuestra historia</a></div></div>
          <div className="relative"><div className="overflow-hidden rounded-[2rem] bg-secondary"><img src={site.settings.heroBannerUrl || HERO_IMAGE} alt={`${appName} en acción`} className="h-[390px] w-full object-cover object-bottom mix-blend-multiply sm:h-[500px]" /></div><div className="absolute -bottom-5 -left-3 rounded-2xl bg-accent p-4 shadow-xl sm:-left-6"><p className="text-3xl font-semibold tracking-tight">{site.pets.length}</p><p className="text-xs font-medium uppercase tracking-wider">vidas en seguimiento</p></div></div>
        </section>

        <section id="adopta" className="scroll-mt-10 py-20"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Encuentra a tu match</p><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Conoce a nuestros rescatados</h2></div><div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-card p-1 text-sm"><Search className="ml-3 size-4 text-muted-foreground" />{['Todos', 'Perro', 'Gato'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 transition ${filter === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}</div></div>{filteredPets.length > 0 ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filteredPets.map((pet) => <a key={pet.id} href={`/adopta/${pet.slug}`} className="group block"><div className={`relative overflow-hidden rounded-3xl ${pet.tone}`}><img src={pet.image} alt={`${pet.name}, ${pet.breed} en adopción`} className="aspect-[0.86] w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">Disponible</span></div><div className="flex items-start justify-between gap-3 px-1 pt-4"><div><h3 className="text-xl font-semibold transition group-hover:text-primary">{pet.name}</h3><p className="mt-1 text-sm text-muted-foreground">{pet.breed} · {pet.age}</p></div><p className="pt-1 text-xs text-muted-foreground">{pet.location}</p></div></a>)}</div> : <div className="rounded-3xl border border-foreground/10 bg-card p-12 text-center text-muted-foreground"><p>Por el momento no hay mascotas en adopción. Vuelve pronto, llegan nuevos rescatados constantemente.</p></div>}</section>

        {featuredPet && <section className="grid gap-8 rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14"><div className="flex flex-col justify-between"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Perfil destacado</p><h2 className="max-w-md text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{featuredPet ? featuredPet.name : 'No hay mascotas publicadas todavía'} está listo para conocerte.</h2><p className="mt-6 max-w-sm leading-7 text-primary-foreground/70">{featuredPet ? `${featuredPet.breed}, cariñoso y listo para encontrar un hogar.` : 'El refugio sigue activo y necesita apoyo para rescates, alimento y veterinaria.'}</p></div><a href={featuredPet ? `/adopta/${featuredPet.slug}` : '/donar'} className="mt-10 w-fit rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground">{featuredPet ? `Quiero conocer a ${featuredPet.name}` : 'Apoyar al refugio'} <ArrowDownRight className="ml-2 inline size-4" /></a></div><div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]"><img src={featuredPet?.image || 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=85'} alt={`${featuredPet?.name || 'refugio'}, mascota rescatada`} className="h-full min-h-72 w-full rounded-3xl object-cover" /><div className="flex flex-col justify-between rounded-3xl bg-primary-foreground/10 p-6"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full border border-primary-foreground/20 px-3 py-1">{featuredPet?.age || '—'}</span><span className="rounded-full border border-primary-foreground/20 px-3 py-1">{featuredPet?.size || '—'}</span><span className="rounded-full border border-primary-foreground/20 px-3 py-1">{featuredPet?.gender || '—'}</span></div><div><p className="mb-2 text-xs uppercase tracking-wider text-primary-foreground/50">Personalidad</p><p className="text-2xl font-medium">{featuredPet?.personality?.slice(0, 3).join(' · ') || 'Sin datos'}</p></div><div className="border-t border-primary-foreground/15 pt-4 text-sm text-primary-foreground/65">{featuredPet?.story || 'Milo convive con otros perros y disfruta los paseos largos.'}</div></div></div></section>}

        <section id="nosotros" className="scroll-mt-10 grid gap-10 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div className="overflow-hidden rounded-[2rem] bg-secondary"><img src={RESCUE_IMAGE} alt="Voluntaria cuidando perros rescatados" className="h-[460px] w-full object-cover" /></div><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Quiénes somos</p><h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">No salvamos mascotas. <span className="text-muted-foreground">Salvamos futuros.</span></h2><p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Nacimos de un grupo de personas que decidió hacer algo frente al abandono. Cada rescate recibe atención médica, alimento, cariño y una familia que lo espera.</p><div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">{['Rescate con respeto', 'Adopción responsable', 'Transparencia total', 'Comunidad que acompaña'].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-medium"><span className="grid size-7 place-items-center rounded-full bg-accent"><Check className="size-4" /></span>{item}</p>)}</div></div></section>

        <section id="impacto" className="scroll-mt-10 rounded-[2rem] bg-accent p-7 sm:p-12"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/60">Nuestro impacto</p><h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Cada gesto se convierte en una historia feliz.</h2></div><p className="max-w-xs text-sm leading-6 text-accent-foreground/70">Con tu ayuda podemos seguir atendiendo rescates urgentes y encontrar hogares para más animales.</p></div><div className="mt-14 grid gap-8 border-t border-accent-foreground/20 pt-8 sm:grid-cols-3"><div><p className="text-5xl font-semibold tracking-[-0.06em]">{site.pets.filter((pet) => pet.status === 'Adoptado').length}</p><p className="mt-2 text-sm text-accent-foreground/65">adopciones felices</p></div><div><p className="text-5xl font-semibold tracking-[-0.06em]">{site.pets.filter((pet) => pet.status !== 'Adoptado').length}</p><p className="mt-2 text-sm text-accent-foreground/65">rescatados activos</p></div><div><p className="text-5xl font-semibold tracking-[-0.06em]">{Math.max(80, Math.round((site.thanksList.filter((thank) => thank.isPublic).length / Math.max(site.thanksList.length, 1)) * 100))}%</p><p className="mt-2 text-sm text-accent-foreground/65">de historias compartidas</p></div></div></section>

        <section id="agradecimientos" className="scroll-mt-10 py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Muro de Reconocimiento</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Gracias por hacer esto posible</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Nuestra labor existe gracias a la generosidad de donantes, padrinos, empresas aliadas y voluntarios dedicados.</p>
          </div>
          {publicThanks.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicThanks.map((t, idx) => (
                <div key={t.id || idx} className="flex flex-col justify-between space-y-4 rounded-3xl border border-foreground/10 bg-card p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={t.img} alt={t.name} className="size-12 rounded-full border border-foreground/10 object-cover" />
                      <div>
                        <h3 className="text-base font-semibold">{t.name}</h3>
                        <span className="text-xs font-medium text-primary">{t.role}</span>
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

        {hasDonationMethods && <section id="donativos" className="scroll-mt-10 flex flex-col justify-between gap-8 py-24 lg:flex-row lg:items-center"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Donativos</p><h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Tu ayuda puede llenar un plato, cubrir una cirugía o cambiar un destino.</h2></div><div className="max-w-sm rounded-3xl border border-foreground/10 bg-card p-6"><p className="text-sm leading-6 text-muted-foreground">Aporta desde $100 MXN y acompáñanos a construir más finales felices.</p><a href="/donar" className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Quiero donar <ArrowRight className="ml-2 inline size-4" /></a></div></section>}

        <section id="formulario" className="scroll-mt-10 grid gap-10 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14"><div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Da el siguiente paso</p><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">¿Listo para adoptar?</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Cuéntanos un poco sobre ti. Nuestro equipo te contactará para conocerte y encontrar tu match ideal.</p></div>{sent ? <div className="flex min-h-72 flex-col items-start justify-center rounded-3xl bg-white p-8 text-foreground shadow-sm"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-2xl font-semibold">¡Recibimos tu solicitud!</h3><p className="mt-2 text-muted-foreground">Te escribiremos muy pronto para continuar.</p></div> : <form className="grid gap-5 rounded-3xl bg-white p-6 text-foreground shadow-sm sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-foreground">Nombre completo<input required name="name" placeholder="Tu nombre" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal text-foreground outline-none transition focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium text-foreground">Correo electrónico<input required type="email" name="email" placeholder="tu@correo.com" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal text-foreground outline-none transition focus:border-foreground" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-foreground">Tipo de vivienda<select name="home" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal text-foreground outline-none"><option>Casa</option><option>Departamento</option><option>Otro</option></select></label><label className="grid gap-2 text-sm font-medium text-foreground">¿Qué mascota te interesa?<select name="pet" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal text-foreground outline-none"><option>Milo</option><option>Luna</option><option>Bruno</option><option>Nube</option></select></label></div><label className="grid gap-2 text-sm font-medium text-foreground">Cuéntanos sobre ti<textarea required name="message" rows={4} placeholder="¿Por por qué quieres adoptar?" className="resize-none rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal text-foreground outline-none transition focus:border-foreground" /></label><button type="submit" className="w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Enviar solicitud <ArrowRight className="ml-2 inline size-4" /></button></form>}</section>

    </PublicPageShell>
  )
}
