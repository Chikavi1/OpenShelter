import { CalendarDays, CheckCircle2, ShieldCheck, Syringe } from 'lucide-react'

export interface VaccinationRecord {
  vaccine: string
  date: string
  clinic?: string
}

interface VaccinationHistoryProps {
  petName: string
  species: string
  records: VaccinationRecord[]
  highlights?: string[]
  nextAppointment?: string
}

export function VaccinationHistory({
  petName,
  species,
  records,
  highlights = [],
  nextAppointment,
}: VaccinationHistoryProps) {
  return (
    <section className="rounded-[2rem] border border-foreground/10 bg-card p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Syringe className="size-4 text-accent-foreground" /> Salud y vacunación
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Historial médico de {petName}
          </h2>
        </div>
        {nextAppointment && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 text-accent-foreground" /> Próxima cita: {nextAppointment}
          </p>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
            >
              <CheckCircle2 className="size-4" /> {item}
            </span>
          ))}
        </div>
      )}

      {records.length === 0 ? (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-foreground/15 bg-secondary/35 px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Historial disponible al concretar la adopción</p>
            <p className="mt-1 text-sm text-muted-foreground">El refugio entregará la cartilla y los certificados veterinarios.</p>
          </div>
        </div>
      ) : (
      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-px bg-foreground/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[1.2fr_auto_1fr_1fr]">
          <p className="bg-card px-5 py-3">Vacuna</p>
          <p className="bg-card px-5 py-3">Fecha</p>
          <p className="hidden bg-card px-5 py-3 sm:block">Clínica</p>
          <p className="bg-card px-5 py-3 text-right">Estado</p>
        </div>
        {records.map((record) => (
          <div
            key={`${record.vaccine}-${record.date}`}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-px bg-foreground/10 text-sm sm:grid-cols-[1.2fr_auto_1fr_1fr]"
          >
            <p className="bg-card px-5 py-4 font-medium">{record.vaccine}</p>
            <p className="bg-card px-5 py-4 text-muted-foreground">{record.date}</p>
            <p className="hidden bg-card px-5 py-4 text-muted-foreground sm:block">{record.clinic ?? '—'}</p>
            <p className="flex items-center justify-end gap-2 bg-card px-5 py-4 text-right">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">Aplicada</span>
            </p>
          </div>
        ))}
      </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
        {species === 'Gato' ? 'Certificados' : 'Cartilla y certificados'} de vacunación disponibles en el
        refugio. Puedes consultarlos y recibirlos al concretar la adopción.
      </p>
    </section>
  )
}
