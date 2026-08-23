export function PublicPageLoader({ label = 'Cargando' }: { label?: string }) {
  return <main className="grid min-h-[70vh] place-items-center bg-background px-6 text-foreground"><div className="text-center"><span className="mx-auto block size-10 animate-spin rounded-full border-2 border-foreground/10 border-t-foreground" /><p className="mt-5 text-sm font-medium text-muted-foreground">{label}…</p></div></main>
}
