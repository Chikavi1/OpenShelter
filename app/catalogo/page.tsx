'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, PawPrint, Search } from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { slugify } from '@/lib/slug'
import { PublicPageShell } from '@/components/public/public-page-shell'

export default function CatalogoPage() {
  const site = usePublicSite()
  const [filter, setFilter] = useState('Todos')
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
    tone: pet.species === 'Perro' ? 'bg-[#dceebf]' : 'bg-[#e9dfd1]',
  }))
  const displayPets = catalogPets
  const filteredPets = useMemo(() => filter === 'Todos' ? displayPets : displayPets.filter((pet) => pet.type === filter), [filter, displayPets])

  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">

        <section className="py-14 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Catálogo de mascotas</p>
              <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Conoce a nuestros <span className="text-muted-foreground">rescatados.</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Cada uno de ellos tiene una historia, una personalidad y ganas inmensas de encontrar su hogar para siempre.</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-card p-1 text-sm sm:self-auto"><Search className="ml-3 size-4 text-muted-foreground" />{['Todos', 'Perro', 'Gato'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 transition ${filter === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}</div>
          </div>

          {filteredPets.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredPets.map((pet) => <a key={pet.id} href={`/adopta/${pet.slug}`} className="group block"><div className={`relative overflow-hidden rounded-3xl ${pet.tone}`}><img src={pet.image} alt={`${pet.name}, ${pet.breed} en adopción`} className="aspect-[0.86] w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">Disponible</span></div><div className="flex items-start justify-between gap-3 px-1 pt-4"><div><h2 className="text-xl font-semibold transition group-hover:text-primary">{pet.name}</h2><p className="mt-1 text-sm text-muted-foreground">{pet.breed} · {pet.age}</p></div><p className="pt-1 text-xs text-muted-foreground">{pet.location}</p></div></a>)}</div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-card p-10 text-center text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Sin mascotas publicadas</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">Hoy no hay adopciones activas</h3>
              <p className="mt-4 text-sm leading-7">Aún así, el refugio sigue necesitando apoyo para alimento, veterinaria y rescates.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/donar" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Donar</a>
                <a href="/contacto" className="rounded-full border border-foreground/15 px-5 py-3 text-sm font-medium">Contactar</a>
              </div>
            </div>
          )}

          <p className="mt-12 text-center text-sm text-muted-foreground">{filteredPets.length > 0 ? `${filteredPets.length} ${filteredPets.length === 1 ? 'mascota disponible' : 'mascotas disponibles'} para adopción responsable.` : 'El refugio sigue activo y abierto a apoyos aunque no haya mascotas publicadas.'}</p>
        </section>

        <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">¿Listo para dar el siguiente paso?</p><h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Algunos de ellos también te están eligiendo a ti.</h2></div><a href="#formulario" className="flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">Quiero adoptar <ArrowRight className="size-4" /></a></div></section>

        <section id="formulario" className="scroll-mt-10 grid gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Da el siguiente paso</p><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Cuéntanos sobre ti.</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Elige una mascota del catálogo y nuestro equipo te contactará para conocerte y agendar una visita al refugio.</p></div>
          <form className="grid gap-5 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Nombre completo<input required name="name" placeholder="Tu nombre" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium">Correo electrónico<input required type="email" name="email" placeholder="tu@correo.com" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label></div>
            <label className="grid gap-2 text-sm font-medium">Mascota de interés<select required name="pet" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none">{displayPets.map((pet) => <option key={pet.id} value={pet.name}>{pet.name} — {pet.breed} ({pet.type})</option>)}</select></label>
            <label className="grid gap-2 text-sm font-medium">¿Por qué quieres adoptar?<textarea required name="message" rows={4} placeholder="Cuéntanos un poco de ti y tu hogar..." className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">Enviar solicitud <ArrowRight className="size-4" /></button>
          </form>
        </section>

    </PublicPageShell>
  )
}
