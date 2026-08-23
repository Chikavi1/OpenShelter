'use client'

import * as Icons from 'lucide-react'
import { useDashboardContext } from '@/components/dashboard/dashboard-context'
import { EventLocationPicker } from '@/components/dashboard/event-location-picker'

type CustomFieldType = string

export function DashboardSettingsTab() {
  const {
    activeTab, settings, settingsSection, setSettingsSection, setSettings, newFieldTarget,
    setNewFieldTarget, newFieldLabel, setNewFieldLabel, newFieldType, setNewFieldType,
    newFieldPlaceholder, setNewFieldPlaceholder, newFieldRequired, setNewFieldRequired,
    newFieldOptionsRaw, setNewFieldOptionsRaw, handleAddCustomField, handleRemoveCustomField,
    getFieldTypeIcon, uploadingImage, imageUploadError, handleImageUpload, handleSaveSettings, settingsSuccess,
  } = useDashboardContext()

  return (<>
  {/* SHELTER SETTINGS TAB */}
  {activeTab === 'settings' && (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-3">
        <button
          onClick={() => setSettingsSection('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'general'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.Building2 className="size-3.5" /> Perfil y Contacto
        </button>

        <button
          onClick={() => setSettingsSection('forms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'forms'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.FileQuestion className="size-3.5" /> Inputs Web & Formularios Dinámicos
        </button>

        <button
          onClick={() => setSettingsSection('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'appearance'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.Palette className="size-3.5" /> Identidad Visual & Fotos
        </button>

        <button
          onClick={() => setSettingsSection('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'support'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.HandCoins className="size-3.5" /> Apoyo & Transferencias
        </button>

        <button
          onClick={() => setSettingsSection('location')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'location'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.MapPin className="size-3.5" /> Ubicación y Horarios
        </button>

        <button
          onClick={() => setSettingsSection('legal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            settingsSection === 'legal'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icons.Scale className="size-3.5" /> Contrato & Reglamento
        </button>
      </div>

      {/* Notification Banner */}
      {settingsSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <Icons.CheckCircle2 className="size-5" />
            ¡Configuración guardada exitosamente! Los cambios han sido aplicados.
          </div>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. General Profile Section */}
        {settingsSection === 'general' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
              <Icons.Building2 className="size-5 text-primary" /> Datos Institucionales
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Nombre del Refugio *
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Lema / Eslogan
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>
            </div>

            <div className="border-t border-foreground/10 pt-5">
              <h3 className="flex items-center gap-2 text-sm font-bold"><Icons.Share2 className="size-4 text-primary" /> Redes sociales</h3>
              <p className="mt-1 text-xs text-muted-foreground">Agrega los enlaces que aparecerán en la web pública.</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                {(['instagram', 'facebook', 'website'] as const).map((network) => <label key={network} className="grid gap-2 text-xs font-semibold uppercase tracking-wider">{network === 'website' ? 'Sitio web' : network}<input type="url" value={settings.socialLinks[network]} onChange={(event) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [network]: event.target.value } })} placeholder={network === 'website' ? 'https://tusitio.org' : `https://${network}.com/...`} className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground" /></label>)}
              </div>
            </div>

            <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
              Descripción de la Organización
              <textarea
                rows={3}
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground resize-none"
              />
            </label>
            <h3 className="text-sm font-bold pt-2 border-t border-foreground/10 flex items-center gap-2">
              <Icons.Phone className="size-4 text-primary" /> Canales de Contacto Directo
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Teléfono Móvil / WhatsApp
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Correo Electrónico Oficial
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>
            </div>
          </div>
        )}

        {/* DYNAMIC WEB INPUT BUILDER SECTION */}
        {settingsSection === 'forms' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Selector of which form to configure */}
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Icons.FileQuestion className="size-5 text-primary" /> Diseñador de Inputs Web para Formularios
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Agrega campos personalizados especificando su tipo HTML real (Texto, Email, Fecha, Booleano, Número, Selección).
                </p>
              </div>

              <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewFieldTarget('adoption')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newFieldTarget === 'adoption' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}
                >
                  Formulario Adopción
                </button>
                <button
                  type="button"
                  onClick={() => setNewFieldTarget('foster')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${newFieldTarget === 'foster' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}
                >
                  Formulario Casa Puente
                </button>
              </div>
            </div>

            {/* Add New Field Box */}
            <div className="p-5 rounded-2xl bg-background border border-foreground/15 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Icons.Plus className="size-4" /> Crear nuevo Input Web para {newFieldTarget === 'adoption' ? 'Adopción' : 'Casa Puente'}
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-1 text-xs font-semibold">
                  Etiqueta / Pregunta *
                  <input
                    type="text"
                    placeholder="Ej. Fecha de nacimiento, ¿Tiene perro?"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                  />
                </label>

                <label className="grid gap-1 text-xs font-semibold">
                  Tipo de Input Web *
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
                    className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none cursor-pointer"
                  >
                    <option value="text">Texto Corto (text)</option>
                    <option value="email">Correo Electrónico (email)</option>
                    <option value="tel">Teléfono (tel)</option>
                    <option value="date">Fecha (date / F.Nacimiento)</option>
                    <option value="number">Número (number)</option>
                    <option value="boolean">Booleano / Sí o No (checkbox/radio)</option>
                    <option value="select">Menú de Selección (select)</option>
                    <option value="textarea">Texto Largo / Área (textarea)</option>
                  </select>
                </label>

                <label className="grid gap-1 text-xs font-semibold">
                  Texto de Ayuda / Placeholder
                  <input
                    type="text"
                    placeholder="Ej. DD/MM/AAAA o Escribe aquí..."
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                    className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                  />
                </label>
              </div>

              {newFieldType === 'select' && (
                <label className="grid gap-1 text-xs font-semibold">
                  Opciones para el Menú de Selección (Separadas por comas) *
                  <input
                    type="text"
                    placeholder="Ej. Menos de 3 horas, De 3 a 6 horas, Más de 6 horas"
                    value={newFieldOptionsRaw}
                    onChange={(e) => setNewFieldOptionsRaw(e.target.value)}
                    className="rounded-xl border border-foreground/15 bg-card px-3 py-2 text-xs outline-none"
                  />
                </label>
              )}

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="rounded border-foreground/20 text-primary size-4"
                  />
                  <span>Campo Obligatorio (Required)</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleAddCustomField(newFieldTarget)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:scale-[1.02] transition"
                >
                  + Agregar Input al Formulario
                </button>
              </div>
            </div>

            {/* Active Fields Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center justify-between">
                <span>Inputs Web Configurados para {newFieldTarget === 'adoption' ? 'Adopción' : 'Casas Puente'}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  ({newFieldTarget === 'adoption' ? settings.adoptionFormFields.length : settings.fosterFormFields.length} campos)
                </span>
              </h3>

              <div className="space-y-2.5">
                        {(newFieldTarget === 'adoption' ? settings.adoptionFormFields : settings.fosterFormFields).map((field: any, idx: number) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-foreground/10 bg-background hover:border-foreground/20 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
                        {getFieldTypeIcon(field.type)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{field.label}</span>
                          {field.required && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                              Requerido
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-0.5">
                          Tipo HTML: <strong className="text-foreground">{field.type}</strong>
                          {field.placeholder && ` · Placeholder: "${field.placeholder}"`}
                          {field.options && ` · Opciones: [${field.options.join(', ')}]`}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(newFieldTarget, field.id)}
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition self-end sm:self-center"
                      title="Eliminar Input"
                    >
                      <Icons.Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Visual Identity & Images */}
        {settingsSection === 'appearance' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
              <Icons.Palette className="size-5 text-primary" /> Personalización Visual & Imágenes
            </h2>

            <div className="space-y-4 rounded-xl border border-foreground/10 bg-background p-4 sm:p-5">
              <div>
                <h3 className="font-semibold">Paleta de colores</h3>
                <p className="mt-1 text-xs text-muted-foreground">Los cambios se aplican en la plataforma al guardar la configuración.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {([
                  ['primary', 'Color primario', 'Botones, enlaces y secciones principales'],
                  ['secondary', 'Color secundario', 'Fondos suaves y elementos de apoyo'],
                  ['background', 'Fondo', 'Fondo general de la plataforma'],
                  ['cta', 'CTA / Acento', 'Llamadas a la acción y destacados'],
                  ['text', 'Texto', 'Texto principal y títulos'],
                  ['surface', 'Superficie', 'Tarjetas, formularios y paneles'],
                ] as const).map(([key, label, description]) => (
                  <label key={key} className="group grid gap-2 rounded-xl border border-foreground/10 bg-card p-3 text-sm">
                    <span className="flex items-center justify-between gap-2 font-medium">
                      {label}
                      <span className="size-6 rounded-full border border-foreground/15 shadow-inner" style={{ backgroundColor: settings.palette[key] }} />
                    </span>
                    <span className="text-[11px] leading-4 text-muted-foreground">{description}</span>
                    <div className="flex items-center gap-2">
                        <input type="color" value={String(settings.palette[key])} onChange={(e) => setSettings((prev: any) => ({ ...prev, palette: { ...prev.palette, [key]: e.target.value } }))} className="h-9 w-11 cursor-pointer rounded-lg border-0 bg-transparent p-0" aria-label={label} />
                            <input type="text" value={String(settings.palette[key])} onChange={(e) => setSettings((prev: any) => ({ ...prev, palette: { ...prev.palette, [key]: e.target.value } }))} pattern="^#[0-9A-Fa-f]{6}$" className="min-w-0 flex-1 rounded-lg border border-foreground/15 bg-background px-2 py-2 font-mono text-xs uppercase outline-none focus:border-primary" aria-label={`${label} en hexadecimal`} />
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {Object.entries(settings.palette).map(([key, color]) => <span key={key} className="rounded-full border border-foreground/10 bg-card px-3 py-1"><i className="mr-1.5 inline-block size-2.5 rounded-full" style={{ backgroundColor: String(color) }} />{key}: {String(color)}</span>)}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3 p-4 rounded-xl border border-foreground/10 bg-background">
                <span className="text-xs font-semibold uppercase tracking-wider block">Logotipo del Refugio</span>
                <div className="flex items-center gap-4">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo Preview"
                      className="size-16 rounded-2xl object-cover border border-foreground/15"
                    />
                  ) : (
                    <div className="grid size-16 place-items-center rounded-2xl border border-dashed border-foreground/15 bg-muted text-[11px] text-muted-foreground">
                      Sin logo
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/20 p-2 text-xs font-medium cursor-pointer transition hover:border-primary/40 hover:text-primary">
                      <Icons.Upload className="size-3.5" />
                      {uploadingImage === 'logo' ? 'Subiendo…' : 'Subir logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploadingImage !== null}
                        onChange={(e) => {
                          void handleImageUpload('logo', e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />
                    </label>
                    <span className="block text-[11px] text-muted-foreground">Solo imágenes PNG, JPG o WebP.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-foreground/10 bg-background">
                <span className="text-xs font-semibold uppercase tracking-wider block">Imagen de Portada Principal</span>
                <div className="space-y-2">
                  <img
                    src={settings.heroBannerUrl}
                    alt="Hero Banner Preview"
                    className="h-16 w-full rounded-xl object-cover border border-foreground/15"
                  />
                  <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-foreground/20 p-2 text-xs font-medium cursor-pointer transition hover:border-primary/40 hover:text-primary">
                    <Icons.Upload className="size-3.5" />
                    {uploadingImage === 'hero' ? 'Subiendo…' : 'Subir portada'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingImage !== null}
                      onChange={(e) => {
                        void handleImageUpload('hero', e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />
                  </label>
                  <span className="block text-[11px] text-muted-foreground">Solo imágenes PNG, JPG o WebP.</span>
                </div>
              </div>
            </div>
            {imageUploadError && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {imageUploadError}
              </p>
            )}
          </div>
        )}

        {/* 4. Location & Schedule */}
        {settingsSection === 'support' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
              <Icons.HandCoins className="size-5 text-primary" /> Apoyo, Transferencias y Donaciones
            </h2>

            <div className="grid gap-5">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Título del bloque de apoyo
                <input
                  type="text"
                  value={settings.supportTitle}
                  onChange={(e) => setSettings({ ...settings, supportTitle: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Descripción del apoyo
                <textarea
                  rows={3}
                  value={settings.supportDescription}
                  onChange={(e) => setSettings({ ...settings, supportDescription: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground resize-none"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Banco
                <input
                  type="text"
                  value={settings.transferBankName}
                  onChange={(e) => setSettings({ ...settings, transferBankName: e.target.value })}
                  placeholder="BBVA"
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                CLABE / Cuenta
                <input
                  type="text"
                  value={settings.transferClabe}
                  onChange={(e) => setSettings({ ...settings, transferClabe: e.target.value })}
                  placeholder="1234 5678 9012 3456 7890"
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Beneficiario
                <input
                  type="text"
                  value={settings.transferOwner}
                  onChange={(e) => setSettings({ ...settings, transferOwner: e.target.value })}
                  placeholder="Nombre de la cuenta"
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
                Concepto / Referencia
                <input
                  type="text"
                  value={settings.transferReference}
                  onChange={(e) => setSettings({ ...settings, transferReference: e.target.value })}
                  placeholder="Donativo Refugio"
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider sm:col-span-2">
                Link de PayPal
                <input
                  type="url"
                  value={settings.paypalUrl}
                  onChange={(e) => setSettings({ ...settings, paypalUrl: e.target.value })}
                  placeholder="https://paypal.me/..."
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
                />
              </label>

              <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider sm:col-span-2">
                Notas / instrucciones para apoyos
                <textarea
                  rows={3}
                  value={settings.supportNotes}
                  onChange={(e) => setSettings({ ...settings, supportNotes: e.target.value })}
                  className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground resize-none"
                />
              </label>
            </div>
          </div>
        )}

        {/* 4. Location & Schedule */}
        {settingsSection === 'location' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
              <Icons.MapPin className="size-5 text-primary" /> Dirección Física y Horarios
            </h2>

            <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
              Calle y Número
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm font-normal outline-none focus:border-foreground"
              />
            </label>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider">Ubicación exacta del refugio</p>
              <EventLocationPicker latitude={settings.latitude} longitude={settings.longitude} logoUrl={settings.logoUrl} onChange={(location) => setSettings({ ...settings, latitude: location.latitude, longitude: location.longitude })} />
            </div>
          </div>
        )}

        {/* 5. Contracts & Rules */}
        {settingsSection === 'legal' && (
          <div className="bg-card border border-foreground/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold border-b border-foreground/10 pb-3 flex items-center gap-2">
              <Icons.Scale className="size-5 text-primary" /> Cláusulas de Adopción y Reglamento
            </h2>

            <label className="grid gap-2 text-xs font-semibold uppercase tracking-wider">
              Contrato Oficial de Adopción Responsable (Términos legales)
              <textarea
                rows={8}
                value={settings.adoptionContractTerms}
                onChange={(e) => setSettings({ ...settings, adoptionContractTerms: e.target.value })}
                className="rounded-xl border border-foreground/15 bg-background p-4 text-xs font-mono leading-relaxed outline-none focus:border-foreground resize-none"
              />
            </label>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-foreground/10">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
          >
            <Icons.Save className="size-4" /> Guardar Configuración de Formularios
          </button>
        </div>
      </form>
    </div>
  )}
  </>)
}
