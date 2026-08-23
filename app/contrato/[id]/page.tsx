'use client'

import { ArrowLeft, Download, FileText, PawPrint, Printer } from 'lucide-react'
import { use } from 'react'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { PublicPageLoader } from '@/components/public/public-page-loader'
import { usePublicSite } from '@/lib/use-public-site'

function formatDate(value?: string) {
  if (!value) return 'Por confirmar'
  if (value.includes('/')) return value

  const parts = value.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0')
    const month = String(parsed.getMonth() + 1).padStart(2, '0')
    const year = parsed.getFullYear()
    return `${day}/${month}/${year}`
  }

  return value
}

export default function ContractPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const site = usePublicSite()
  const { id } = use(params)

  if (site.loading) return <PublicPageLoader label="Cargando contrato" />

  const followUp = site.followUps.find((item) => item.id === id)
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL

  if (!followUp) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-center text-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contrato no disponible</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">No encontramos este contrato</h1>
        <a href="/dashboard" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ir al panel</a>
      </main>
    )
  }

  const terms = site.settings.adoptionContractTerms || 'El adoptante se compromete a brindar alimento, atención médica y un trato digno.'

  const pdfUrl = `/api/contracts/${followUp.id}/pdf`

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver al panel
        </a>
        <a href={pdfUrl} className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-sm font-medium transition hover:bg-secondary">
          <Download className="size-4" /> Descargar PDF
        </a>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-sm font-medium transition hover:bg-secondary">
          <Printer className="size-4" /> Imprimir
        </button>
      </div>

      <section className="overflow-hidden rounded-[32px] border border-foreground/10 bg-card shadow-sm print:shadow-none">
        <div className="border-b border-foreground/10 bg-secondary/40 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contrato de adopción</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{followUp.petName}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Documento para adopción y seguimiento del hogar</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fecha de adopción</p>
              <p className="mt-1 text-lg font-medium">{formatDate(followUp.adoptionDate)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard label="Adoptante" value={followUp.adopterName} />
              <InfoCard label="Correo" value={followUp.adopterEmail} />
              <InfoCard label="Teléfono" value={followUp.adopterPhone} />
              <InfoCard label="Ciudad" value={followUp.adopterCity || 'No registrada'} />
              <InfoCard label="Dirección" value={followUp.adopterAddress || 'No registrada'} className="sm:col-span-2" />
            </div>

            <div className="rounded-[28px] border border-foreground/10 bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Términos del contrato</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">{terms}</p>
            </div>

            <div className="rounded-[28px] border border-foreground/10 bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Compromisos del adoptante</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>• Mantener a la mascota con alimento, agua y atención veterinaria adecuada.</li>
                <li>• No abandonar, ceder ni reproducir sin autorización del refugio.</li>
                <li>• Permitir seguimiento y contacto por parte de la organización.</li>
                <li>• Informar cambios relevantes de domicilio, salud o cuidado.</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[28px] border border-foreground/10 bg-secondary/35 p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <PawPrint className="size-5 text-primary" /> Refugio
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{appName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{site.settings.email}</p>
            </div>

            <div className="rounded-[28px] border border-foreground/10 bg-background p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <FileText className="size-5 text-primary" /> Resumen
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Mascota</dt><dd className="font-medium">{followUp.petName}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Proceso</dt><dd className="font-medium">{followUp.processStage}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Siguiente revisión</dt><dd className="font-medium">{formatDate(followUp.nextFollowUpDate)}</dd></div>
              </dl>
            </div>

            <button onClick={() => window.print()} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 print:hidden">
              <Download className="size-4" /> Descargar / imprimir
            </button>
          </aside>
        </div>

        <div className="grid gap-6 border-t border-foreground/10 px-6 py-6 sm:px-8 md:grid-cols-2 print:gap-10 print:py-8">
          <SignatureBlock title="Firma del adoptante" />
          <SignatureBlock title="Firma del refugio" />
        </div>
      </section>
    </PublicPageShell>
  )
}

function InfoCard({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-[22px] border border-foreground/10 bg-secondary/25 p-4 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  )
}

function SignatureBlock({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="h-20 rounded-2xl border border-dashed border-foreground/20 bg-background" />
    </div>
  )
}
