'use client'

import { useEffect, useState, type ReactElement } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  HandCoins,
  Heart,
  Landmark,
  PawPrint,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { usePublicSite } from '@/lib/use-public-site'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { getDonationMethods } from '@/lib/donation-methods'

const amounts = [100, 250, 500, 1000]

export default function DonarPage() {
  const site = usePublicSite()
  const [amount, setAmount] = useState(250)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL
  const paymentMethods = getDonationMethods(site.settings).map((method) => ({
    ...method,
    icon: method.id === 'transfer' ? <Landmark className="size-5" /> : <Wallet className="size-5" />,
  }))
  const [method, setMethod] = useState<'transfer' | 'paypal' | ''>('')
  const hasTransferData = Boolean(site.settings.transferBankName && site.settings.transferClabe)
  const showAmountControls = method !== 'transfer'

  useEffect(() => {
    if (!paymentMethods.length) {
      setMethod('')
      return
    }

    if (!paymentMethods.some((option) => option.id === method)) {
      setMethod(paymentMethods[0].id)
    }
  }, [method, paymentMethods])

  function copyClabe(clabe: string) {
    navigator.clipboard?.writeText(clabe.replace(/\s/g, ''))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">

        <section className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"><span className="size-2 rounded-full bg-accent" /> {site.settings.supportTitle || 'Donativos y apoyo'}</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.065em] sm:text-7xl">{site.settings.supportTitle || 'Tu ayuda se convierte en patitas.'}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">{site.settings.supportDescription || 'Cada peso se destina directo al rescate, alimento, vacunas y manutención.'}</p>
            <div className="mt-8 flex flex-wrap gap-3">{['100% al rescate', 'Transferencias', 'Transparencia total'].map((item) => <span key={item} className="flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm"><ShieldCheck className="size-4 text-accent-foreground" /> {item}</span>)}</div>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-secondary"><img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=85" alt="Perro y gato rescatados en adopción" className="h-[380px] w-full object-cover mix-blend-multiply sm:h-[480px]" /></div>
        </section>

        <section id="formulario" className="scroll-mt-8 grid gap-10 rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Haz tu donativo</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Elige cómo quieres ayudar.</h2>
            <p className="mt-5 max-w-sm leading-7 text-muted-foreground">Puedes aportar una vez o acompañarnos cada mes con una aportación recurrente.</p>
            {paymentMethods.length > 0 ? (
              <>
                <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">1</span> {method === 'transfer' ? 'Revisa los datos de transferencia' : 'Define tu aportación'}</div>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">2</span> Elige el método de pago</div>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-foreground/10">3</span> Confirma y listo</div>
              </>
            ) : (
              <div className="mt-10 rounded-3xl border border-dashed border-foreground/15 bg-card p-6 text-sm text-muted-foreground">
                Todavía no hay métodos de donación configurados.
              </div>
            )}
          </div>

          {sent ? <div className="flex min-h-96 flex-col justify-center rounded-3xl bg-accent p-8 text-accent-foreground"><span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check /></span><h3 className="mt-5 text-3xl font-semibold">{method === 'transfer' ? '¡Datos listos para transferir!' : '¡Gracias por tu donativo!'}</h3><p className="mt-3 max-w-sm leading-7">{method === 'transfer' ? 'Revisa los datos bancarios y realiza la transferencia con el monto que prefieras. Enviamos la información a tu correo.' : `Tu aportación de $${amount} MXN ya está en camino. Enviamos un comprobante a tu correo.`}</p><a href="/" className="mt-7 flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Volver al inicio <ArrowRight className="size-4" /></a></div> : paymentMethods.length > 0 ? (
            <form className="grid gap-6 rounded-3xl border border-foreground/10 bg-background p-6 sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true) }}>
              <div>
                <label className="mb-2 block text-sm font-medium">Método de pago</label>
                <div className="grid gap-2">{paymentMethods.map((option) => <button key={option.id} type="button" onClick={() => setMethod(option.id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${method === option.id ? 'border-primary bg-accent/40' : 'border-foreground/15 hover:border-foreground/30'}`}><span className={`grid size-11 shrink-0 place-items-center rounded-full ${method === option.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>{option.icon}</span><span className="flex-1"><span className="block text-sm font-medium">{option.label}</span><span className="block text-xs text-muted-foreground">{option.desc}</span></span>{method === option.id && <Check className="size-5 text-primary" />}</button>)}</div>
              </div>

              {showAmountControls && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Monto (MXN)</label>
                  <div className="grid grid-cols-4 gap-2">{amounts.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${amount === value ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/15 hover:border-foreground/30'}`}>${value}</button>)}</div>
                  <label className="mt-2 grid gap-2 text-sm font-medium">Monto personalizado<input min={1} inputMode="numeric" name="custom-amount" placeholder="Otro monto" value={amount} onChange={(event) => setAmount(Number(event.target.value) || 0)} className="rounded-xl border border-foreground/15 bg-card px-4 py-3 font-normal outline-none transition focus:border-foreground" /></label>
                </div>
              )}

              {method === 'transfer' && <div className="grid gap-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><QrCode className="size-5 text-accent-foreground" /> Usa los datos configurados en el panel de apoyo.</p>
                {hasTransferData ? <div className="rounded-2xl border border-foreground/10 bg-card p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Transferencia a {site.settings.transferBankName}</p><span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Datos configurados</span></div><dl className="mt-4 grid gap-3 text-sm">{[{ label: 'CLABE', value: site.settings.transferClabe }, { label: 'Beneficiario', value: site.settings.transferOwner }, { label: 'Concepto', value: site.settings.transferReference }].map((row) => <div key={row.label} className="flex flex-wrap items-center justify-between gap-2"><dt className="text-muted-foreground">{row.label}</dt><dd className="flex items-center gap-2 font-medium"><span>{row.value || '—'}</span>{row.label === 'CLABE' && row.value && <button type="button" aria-label="Copiar CLABE" onClick={() => copyClabe(row.value)} className="grid size-8 place-items-center rounded-full border border-foreground/15 transition hover:bg-muted">{copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}</button>}</dd></div>)}</dl></div> : <div className="rounded-2xl border border-dashed border-foreground/15 bg-card p-5 text-sm text-muted-foreground">Aún no hay cuentas de transferencia configuradas.</div>}
              </div>}

              {method === 'paypal' && <div className="rounded-2xl border border-foreground/10 bg-card p-6 text-sm text-muted-foreground"><p className="flex items-center gap-3"><Wallet className="size-5 text-accent-foreground" /> {site.settings.paypalUrl ? <a href={site.settings.paypalUrl} target="_blank" rel="noreferrer" className="text-foreground underline decoration-accent decoration-2 underline-offset-2">Abrir PayPal</a> : 'PayPal aún no está configurado.'} <strong className="text-foreground">${amount} MXN</strong></p><a href={site.settings.paypalUrl || '#'} target={site.settings.paypalUrl ? '_blank' : undefined} rel={site.settings.paypalUrl ? 'noreferrer' : undefined} className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-medium text-primary-foreground transition ${site.settings.paypalUrl ? 'bg-primary hover:scale-[1.01]' : 'cursor-not-allowed bg-foreground/20'}`}><HandCoins className="size-4" /> {site.settings.paypalUrl ? `Abrir PayPal y donar $${amount} MXN` : 'PayPal no disponible'} <ArrowRight className="size-4" /></a></div>}

              {method === 'transfer' && (
              <></>
              )}

              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Pago protegido. No guardamos tus datos bancarios.</p>
            </form>
          ) : (
            <div className="grid gap-6 rounded-3xl border border-dashed border-foreground/15 bg-background p-6 sm:p-8">
              <div className="rounded-2xl border border-foreground/10 bg-card p-6 text-sm text-muted-foreground">
                Por ahora no hay métodos de donación configurados.
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] bg-accent p-7 sm:p-12"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/60">Otras formas de ayudar</p><h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">¿No puedes donar? También cuentas.</h2></div><div className="grid max-w-xl gap-4 sm:grid-cols-2">{['Voluntariado', 'Hogar temporal', 'Donar alimento', 'Padrino de adopción'].map((item) => <p key={item} className="flex items-center gap-3 rounded-2xl bg-accent-foreground/5 p-4 text-sm font-medium"><span className="grid size-8 place-items-center rounded-full bg-accent-foreground/15"><Heart className="size-4" /></span>{item}</p>)}</div></div>{site.settings.supportNotes ? <p className="mt-6 text-sm leading-7 text-accent-foreground/75">{site.settings.supportNotes}</p> : null}</section>

    </PublicPageShell>
  )
}
