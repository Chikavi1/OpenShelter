'use client'

import { ArrowLeft, ArrowRight, Heart, PawPrint, Star } from 'lucide-react'

const thanks = [
  { name: 'Veterinaria San Antonio', role: 'Empresa Aliada', contribution: 'Campañas de esterilización gratuita', msg: 'Gracias por brindar atención médica profesional y de corazón a nuestros rescatados.', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80' },
  { name: 'Gonzalo & Sofía', role: 'Donantes', contribution: '$5,000 MXN en alimento ProPlan', msg: 'Su aportación permitió alimentar a la camada de 6 cachorros durante dos meses completos.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Lucía Fernández', role: 'Voluntaria Fotógrafa', contribution: 'Fotografía profesional de catálogo', msg: 'Gracias a sus fotos, 4 perritos consiguieron familia en tiempo récord.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
  { name: 'Clínica Felina El Ronroneo', role: 'Empresa Aliada', contribution: 'Atención felina con costo preferencial', msg: 'Han acompañado a nuestras gatas rescatadas con cariño y experiencia en cada etapa.', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80' },
  { name: 'Mariana Torres', role: 'Padrina', contribution: 'Manutención mensual de 2 mascotas', msg: 'Un año entero cubriendo alimento, vacunas y seguimiento de Bruno y Nube.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
  { name: 'Ricardo Salinas', role: 'Voluntario', contribution: 'Transporte de rescates', msg: 'Siempre disponible para mover a los rescatados a la clínica o a su nuevo hogar.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
]

const impact = [
  { value: '16', label: 'adopciones felices' },
  { value: '10', label: 'rescates atendidos' },
  { value: '12', label: 'aliados y voluntarios' },
  { value: '92%', label: 'de donativos directo al rescate' },
]

export default function ReconocimientoPage() {
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
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> Muro de Reconocimiento</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-6xl">Gracias por hacer <span className="text-muted-foreground">esto posible.</span></h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Nuestra labor existe gracias a la generosidad de donantes, padrinos, empresas aliadas y voluntarios dedicados.</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-accent p-7 sm:p-12"><div className="grid gap-8 border-b border-accent-foreground/20 pb-8 sm:grid-cols-2 lg:grid-cols-4">{impact.map((item) => <div key={item.label}><p className="text-5xl font-semibold tracking-[-0.06em]">{item.value}</p><p className="mt-2 text-sm text-accent-foreground/65">{item.label}</p></div>)}</div><div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><p className="max-w-xl text-sm leading-6 text-accent-foreground/70">Cada aportación, por pequeña que sea, deja huella en la vida de una mascota rescatada.</p><a href="/donar" className="flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"><Heart className="size-4" /> Únete a la lista <ArrowRight className="size-4" /></a></div></section>

        <section className="py-20">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Personas que dejan huella</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">Este año nos acompañaron con su tiempo, su talento y su generosidad.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {thanks.map((t) => (
              <div key={t.name} className="flex flex-col justify-between space-y-4 rounded-3xl border border-foreground/10 bg-card p-6">
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
        </section>

        <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">¿Quieres ser parte?</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Tu nombre podría aparecer aquí.</h2></div><a href="/donar" className="flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">Haz un donativo <ArrowRight className="size-4" /></a></div></section>

        <footer className="flex flex-col justify-between gap-5 border-t border-foreground/10 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-semibold text-foreground">{appName.toLowerCase()}.</p><p>Hecho con amor para quienes no tienen voz.</p><a href="/" className="hover:text-foreground">Volver al inicio</a></footer>
      </div>
    </main>
  )
}
