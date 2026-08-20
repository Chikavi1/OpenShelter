import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

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

export const shelterSettings = pgTable('shelter_settings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
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
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const schema = {
  pets,
  adoptionApplications,
  fosterHomes,
  sponsorThanks,
  shelterSettings,
}
