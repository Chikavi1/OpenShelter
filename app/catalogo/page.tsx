'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, PawPrint, Search } from 'lucide-react'

const pets = [
  { id: 1, name: 'Milo', slug: 'milo', type: 'Perro', age: '2 años', breed: 'Mestizo', location: 'CDMX', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', tone: 'bg-[#dceebf]' },
  { id: 2, name: 'Luna', slug: 'luna', type: 'Gato', age: '1 año', breed: 'Carey', location: 'CDMX', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85', tone: 'bg-[#e9dfd1]' },
  { id: 3, name: 'Bruno', slug: 'bruno', type: 'Perro', age: '4 años', breed: 'Labrador', location: 'Toluca', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85', tone: 'bg-[#dce5d2]' },
  { id: 4, name: 'Nube', slug: 'nube', type: 'Gato', age: '8 meses', breed: 'Blanco', location: 'Puebla', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85', tone: 'bg-[#e8e2d8]' },
]

export default function CatalogoPage() {
  const [filter, setFilter] = useState('Todos')
  const filteredPets = useMemo(() => filter === 'Todos' ? pets : pets.filter((pet) => pet.type === filter), [filter])

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'huellas'
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-foreground/10 py-5">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">{logoUrl ? <img src={logoUrl} alt={appName} className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><PawPrint className="size-4" /></span>} {appName.toLowerCase()}</a>
          <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-4" /> Volver al inicio</a>
        </header>

        <section className="py-14 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Catálogo de mascotas</p>
              <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Conoce a nuestros <span className="text-muted-foreground">rescatados.</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Cada uno de ellos tiene una historia, una personalidad y ganas inmensas de encontrar su hogar para siempre.</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-card p-1 text-sm sm:self-auto"><Search className="ml-3 size-4 text-muted-foreground" />{['Todos', 'Perro', 'Gato'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 transition ${filter === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}</div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredPets.map((pet) => <a key={pet.id} href={`/adopta/${pet.slug}`} className="group block"><div className={`relative overflow-hidden rounded-3xl ${pet.tone}`}><img src={pet.image} alt={`${pet.name}, ${pet.breed} en adopción`} className="aspect-[0.86] w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">Disponible</span></div><div className="flex items-start justify-between gap-3 px-1 pt-4"><div><h2 className="text-xl font-semibold transition group-hover:text-primary">{pet.name}</h2><p className="mt-1 text-sm text-muted-foreground">{pet.breed} · {pet.age}</p></div><p className="pt-1 text-xs text-muted-foreground">{pet.location}</p></div></a>)}</div>

          <p className="mt-12 text-center text-sm text-muted-foreground">{filteredPets.length} {filteredPets.length === 1 ? 'mascota disponible' : 'mascotas disponibles'} para adopción responsable.</p>
        </section>

        <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">¿Listo para dar el siguiente paso?</p><h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Algunos de ellos también te están eligiendo a ti.</h2></div><a href="#formulario" className="flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">Quiero adoptar <ArrowRight className="size-4" /></a></div></section>

        <section id="formulario" className="scroll-mt-10 grid gap-10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Da el siguiente paso</p><h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Cuéntanos sobre ti.</h2><p className="mt-5 max-w-sm leading-7 text-muted-foreground">Elige una mascota del catálogo y nuestro equipo te contactará para conocerte y agendar una visita al refugio.</p></div>
          <form className="grid gap-5 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Nombre completo<input required name="name" placeholder="Tu nombre" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label><label className="grid gap-2 text-sm font-medium">Correo electrónico<input required type="email" name="email" placeholder="tu@correo.com" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label></div>
            <label className="grid gap-2 text-sm font-medium">Mascota de interés<select required name="pet" className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none">{pets.map((pet) => <option key={pet.id} value={pet.name}>{pet.name} — {pet.breed} ({pet.type})</option>)}</select></label>
            <label className="grid gap-2 text-sm font-medium">¿Por qué quieres adoptar?<textarea required name="message" rows={4} placeholder="Cuéntanos un poco de ti y tu hogar..." className="rounded-xl border border-foreground/15 bg-background px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label>
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.01]">Enviar solicitud <ArrowRight className="size-4" /></button>
          </form>
        </section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
