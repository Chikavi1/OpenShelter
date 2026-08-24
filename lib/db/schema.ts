import { boolean, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'

export const petSpeciesEnum = pgEnum('pet_species', ['Perro', 'Gato', 'Otro'])
export const petGenderEnum = pgEnum('pet_gender', ['Macho', 'Hembra'])
export const petSizeEnum = pgEnum('pet_size', ['Pequeño', 'Mediano', 'Grande'])
export const petStatusEnum = pgEnum('pet_status', ['Disponible', 'En Proceso', 'Adoptado'])
export const applicationHomeTypeEnum = pgEnum('application_home_type', ['Casa', 'Departamento', 'Otro'])
export const applicationStatusEnum = pgEnum('application_status', ['Pendiente', 'En revisión', 'Aprobada', 'Rechazada'])
export const fosterHomeTypeEnum = pgEnum('foster_home_type', ['Casa', 'Departamento', 'Finca'])
export const fosterSpeciesEnum = pgEnum('foster_species', ['Perros', 'Gatos', 'Cualquiera'])
export const fosterStatusEnum = pgEnum('foster_status', ['Activa', 'En pausa', 'Disponible'])
export const thankRoleEnum = pgEnum('thank_role', ['Donante', 'Voluntario', 'Empresa Aliada', 'Padrino'])
export const adoptionFollowUpStageEnum = pgEnum('adoption_follow_up_stage', ['Pendiente', 'Contrato firmado', 'Entregado', 'Seguimiento 1', 'Seguimiento 2', 'Cerrado'])
export const shelterEventStatusEnum = pgEnum('shelter_event_status', ['Programado', 'En preparación', 'En curso', 'Finalizado', 'Cancelado'])
export const shelterEventCategoryEnum = pgEnum('shelter_event_category', ['Adopción', 'Recaudación', 'Voluntariado', 'Vacunación', 'Educativo'])
export const customFieldTypeEnum = pgEnum('custom_field_type', ['text', 'email', 'tel', 'date', 'number', 'select', 'boolean', 'textarea'])

export const pets = pgTable('pets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  species: petSpeciesEnum('species').notNull(),
  breed: text('breed').notNull(),
  age: text('age').notNull(),
  gender: petGenderEnum('gender').notNull(),
  size: petSizeEnum('size').notNull(),
  status: petStatusEnum('status').notNull(),
  location: text('location').notNull(),
  image: text('image').notNull(),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  featured: boolean('featured').notNull().default(false),
  health: jsonb('health').$type<string[]>().notNull(),
  personality: jsonb('personality').$type<string[]>().notNull(),
  story: text('story').notNull(),
  views: integer('views').notNull().default(0),
  applicationsCount: integer('applications_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('pets_status_idx').on(table.status),
  nameIdx: index('pets_name_idx').on(table.name),
}))

export const adoptionApplications = pgTable('adoption_applications', {
  id: text('id').primaryKey(),
  applicantName: text('applicant_name').notNull(),
  applicantEmail: text('applicant_email').notNull(),
  applicantPhone: text('applicant_phone').notNull(),
  applicantAddress: text('applicant_address').notNull().default(''),
  applicantCity: text('applicant_city').notNull().default(''),
  petName: text('pet_name').notNull(),
  petId: text('pet_id').references(() => pets.id, { onDelete: 'set null' }),
  petImage: text('pet_image').notNull(),
  homeType: applicationHomeTypeEnum('home_type').notNull(),
  hasOtherPets: boolean('has_other_pets').notNull(),
  yard: boolean('yard').notNull(),
  status: applicationStatusEnum('status').notNull(),
  dateSubmitted: text('date_submitted').notNull(),
  experience: text('experience').notNull(),
  customResponses: jsonb('custom_responses').$type<Record<string, string | boolean>>(),
  documents: jsonb('documents').$type<Array<{ type: string; name: string; url: string; key?: string; uploadedAt: string }>>().notNull().default([]),
  verification: jsonb('verification').$type<{ identity: boolean; address: boolean; homeConditions: boolean; interview: boolean; references: boolean; eligibility: boolean }>().notNull().default({ identity: false, address: false, homeConditions: false, interview: false, references: false, eligibility: false }),
  reviewNotes: text('review_notes').notNull().default(''),
  reviewedAt: text('reviewed_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('adoption_applications_status_idx').on(table.status),
  petIdx: index('adoption_applications_pet_id_idx').on(table.petId),
}))

export const fosterHomes = pgTable('foster_homes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  homeType: fosterHomeTypeEnum('home_type').notNull(),
  yard: boolean('yard').notNull(),
  preferredSpecies: fosterSpeciesEnum('preferred_species').notNull(),
  maxCapacity: integer('max_capacity').notNull(),
  currentPetsCount: integer('current_pets_count').notNull().default(0),
  status: fosterStatusEnum('status').notNull(),
  notes: text('notes').notNull(),
  registeredDate: text('registered_date').notNull(),
  currentFosteredPet: text('current_fostered_pet'),
  customResponses: jsonb('custom_responses').$type<Record<string, string | boolean>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('foster_homes_status_idx').on(table.status),
  cityIdx: index('foster_homes_city_idx').on(table.city),
}))

export const sponsorThanks = pgTable('sponsor_thanks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: thankRoleEnum('role').notNull(),
  amountOrContribution: text('amount_or_contribution').notNull(),
  message: text('message').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  date: text('date').notNull(),
  isPublic: boolean('is_public').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  publicIdx: index('sponsor_thanks_is_public_idx').on(table.isPublic),
}))

export const adoptionFollowUps = pgTable('adoption_followups', {
  id: text('id').primaryKey(),
  petId: text('pet_id').references(() => pets.id, { onDelete: 'set null' }),
  petName: text('pet_name').notNull(),
  adopterName: text('adopter_name').notNull(),
  adopterEmail: text('adopter_email').notNull(),
  adopterPhone: text('adopter_phone').notNull(),
  adopterAddress: text('adopter_address').notNull(),
  adopterCity: text('adopter_city').notNull(),
  adoptionDate: text('adoption_date').notNull(),
  nextFollowUpDate: text('next_follow_up_date').notNull(),
  processStage: adoptionFollowUpStageEnum('process_stage').notNull(),
  notes: text('notes').notNull(),
  carePlan: text('care_plan').notNull(),
  applicationId: text('application_id').references(() => adoptionApplications.id, { onDelete: 'set null' }),
  lastContactDate: text('last_contact_date'),
  verificationStatus: text('verification_status').notNull().default('Pendiente'),
  followUpChecks: jsonb('follow_up_checks').$type<{ contacted: boolean; petSafe: boolean; healthUpToDate: boolean; conditionsMet: boolean }>().notNull().default({ contacted: false, petSafe: false, healthUpToDate: false, conditionsMet: false }),
  incidents: text('incidents').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  stageIdx: index('adoption_followups_process_stage_idx').on(table.processStage),
  petIdx: index('adoption_followups_pet_id_idx').on(table.petId),
}))

export const shelterEvents = pgTable('shelter_events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  image: text('image').notNull().default('/events.png'),
  category: shelterEventCategoryEnum('category').notNull(),
  status: shelterEventStatusEnum('status').notNull(),
  eventDate: text('event_date').notNull(),
  eventTime: text('event_time').notNull(),
  location: text('location').notNull(),
  latitude: real('latitude').notNull().default(19.4326),
  longitude: real('longitude').notNull().default(-99.1332),
  attendeesTarget: integer('attendees_target').notNull().default(0),
  contactName: text('contact_name').notNull(),
  contactPhone: text('contact_phone').notNull(),
  registrationLink: text('registration_link').notNull(),
  description: text('description').notNull(),
  notes: text('notes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('shelter_events_status_idx').on(table.status),
  dateIdx: index('shelter_events_event_date_idx').on(table.eventDate),
}))

export const shelterSettings = pgTable('shelter_settings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  latitude: real('latitude').notNull().default(19.4326),
  longitude: real('longitude').notNull().default(-99.1332),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  zipCode: text('zip_code').notNull(),
  primaryColor: text('primary_color').notNull(),
  accentColor: text('accent_color').notNull(),
  palette: jsonb('palette').$type<{ primary: string; secondary: string; background: string; cta: string; text: string; surface: string }>().notNull().default({
    primary: '#163b2d', secondary: '#e8e1d5', background: '#f5f1e9', cta: '#c5e86c', text: '#24352d', surface: '#fcfaf6',
  }),
  logoUrl: text('logo_url').notNull(),
  heroBannerUrl: text('hero_banner_url').notNull(),
  adoptionContractTerms: text('adoption_contract_terms').notNull(),
  shelterRules: text('shelter_rules').notNull(),
  visitingHours: text('visiting_hours').notNull(),
  supportTitle: text('support_title').notNull(),
  supportDescription: text('support_description').notNull(),
  transferBankName: text('transfer_bank_name').notNull(),
  transferClabe: text('transfer_clabe').notNull(),
  transferOwner: text('transfer_owner').notNull(),
  transferReference: text('transfer_reference').notNull(),
  paypalUrl: text('paypal_url').notNull(),
  supportNotes: text('support_notes').notNull(),
  adoptionFormFields: jsonb('adoption_form_fields').$type<Array<{ id: string; label: string; type: string; placeholder?: string; required: boolean; options?: string[] }>>().notNull(),
  fosterFormFields: jsonb('foster_form_fields').$type<Array<{ id: string; label: string; type: string; placeholder?: string; required: boolean; options?: string[] }>>().notNull(),
  fosterRequirements: text('foster_requirements').notNull(),
  socialLinks: jsonb('social_links').$type<{ instagram: string; facebook: string; website: string }>().notNull(),
  aboutContent: jsonb('about_content').$type<{
    heroKicker: string; heroTitle: string; heroHighlight: string; heroDescription: string
    storyImageUrl: string; storyKicker: string; storyTitle: string; storyParagraphs: string[]
    valuesKicker: string; valuesTitle: string; valuesDesc: string; values: Array<{ title: string; desc: string }>
    stepsKicker: string; stepsTitle: string; stepsDesc: string; steps: Array<{ n: string; title: string; desc: string }>
    ctaKicker: string; ctaTitle: string; ctaDesc: string
  }>().notNull().default({
    heroKicker: 'Quiénes somos',
    heroTitle: 'No salvamos mascotas.',
    heroHighlight: 'Salvamos futuros.',
    heroDescription: 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con familias amorosas. Nacimos de un grupo de vecinos que decidió no mirar hacia otro lado.',
    storyImageUrl: 'https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop',
    storyKicker: 'Nuestra historia',
    storyTitle: 'De un rescate a una red de apoyo',
    storyParagraphs: [
      'Empezamos rescatando a uno. Hoy somos una comunidad de voluntarios, veterinarios, hogares temporales y familias que han decidido que ningún animal se quede atrás. Cada caso nos enseña que con cuidado, paciencia y compromiso, una vida puede cambiar por completo.',
      'Trabajamos en CDMX y colaboramos con hogares temporales en toda la zona metropolitana. Todo lo que hacemos se sostiene con donativos y trabajo voluntario.',
    ],
    valuesKicker: 'Lo que nos mueve',
    valuesTitle: 'Nuestros valores',
    valuesDesc: 'No somos un albergue masivo. Somos una red pequeña que hace las cosas con cuidado, para que cada adopción dure para siempre.',
    values: [
      { title: 'Rescate con respeto', desc: 'Cada intervención prioriza el bienestar del animal, sin violencia y con acompañamiento veterinario.' },
      { title: 'Adopción responsable', desc: 'Evaluamos compatibilidad, damos seguimiento y acompañamos a la familia después de la entrega.' },
      { title: 'Transparencia total', desc: 'Cada donativo se reporta y cada historia se comparte. Nada se esconde.' },
      { title: 'Comunidad que acompaña', desc: 'Voluntarios, hogares temporales y padrinos hacen posible lo que solos no podríamos.' },
    ],
    stepsKicker: 'Cómo trabajamos',
    stepsTitle: 'Del rescate al hogar',
    stepsDesc: 'Un proceso claro, humano y con seguimiento. No entregamos mascotas a la ligera.',
    steps: [
      { n: '01', title: 'Rescate', desc: 'Rescatamos reportes de abandono, maltrato o extravío y damos atención inmediata.' },
      { n: '02', title: 'Rehabilitación', desc: 'Atención veterinaria, esterilización, vacunas, desparasitación y terapia conductual si hace falta.' },
      { n: '03', title: 'Hogar temporal', desc: 'Los rescatados conviven en hogares temporales donde recuperan confianza y rutina.' },
      { n: '04', title: 'Adopción y seguimiento', desc: 'Conectamos con la familia ideal y damos seguimiento post-adopción con visitas y apoyo.' },
    ],
    ctaKicker: 'Súmate',
    ctaTitle: 'Hay muchas formas de ayudar, incluso si no puedes adoptar ahora.',
    ctaDesc: 'Dona, ofrece hogar temporal, comparte un perfil o visítanos. Cada gesto cuenta y lo agradecemos de corazón.',
  }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const schema = {
  pets,
  adoptionApplications,
  fosterHomes,
  sponsorThanks,
  adoptionFollowUps,
  shelterEvents,
  shelterSettings,
}
