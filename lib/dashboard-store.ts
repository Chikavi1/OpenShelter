import { eq } from 'drizzle-orm'
import { getDb } from './db/client'
import { adoptionApplications, adoptionFollowUps, fosterHomes, pets, shelterEvents, shelterSettings, sponsorThanks } from './db/schema'
import {
  DEFAULT_DASHBOARD_STATE,
  type AdoptionApplication,
  type AdoptionApplicationDocument,
  type AdoptionFollowUp,
  type CustomFormField,
  type DashboardState,
  type FosterHome,
  type ShelterEvent,
  type ShelterSettings,
} from './dashboard-defaults'

async function hasStoredDashboardData() {
  const db = getDb()
  const [petRows, applicationRows, fosterRows, thanksRows, followUpRows, eventRows, settingsRows] = await Promise.all([
    db.select({ id: pets.id }).from(pets).limit(1),
    db.select({ id: adoptionApplications.id }).from(adoptionApplications).limit(1),
    db.select({ id: fosterHomes.id }).from(fosterHomes).limit(1),
    db.select({ id: sponsorThanks.id }).from(sponsorThanks).limit(1),
    db.select({ id: adoptionFollowUps.id }).from(adoptionFollowUps).limit(1),
    db.select({ id: shelterEvents.id }).from(shelterEvents).limit(1),
    db.select({ name: shelterSettings.name }).from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
  ])

  return [
    petRows[0]?.id,
    applicationRows[0]?.id,
    fosterRows[0]?.id,
    thanksRows[0]?.id,
    followUpRows[0]?.id,
    eventRows[0]?.id,
  ].some(Boolean) || Boolean(settingsRows[0])
}

function normalizeState(state: Partial<DashboardState>): DashboardState {
  return {
    pets: state.pets ?? DEFAULT_DASHBOARD_STATE.pets,
    applications: state.applications ?? DEFAULT_DASHBOARD_STATE.applications,
    fosterHomes: state.fosterHomes ?? DEFAULT_DASHBOARD_STATE.fosterHomes,
    thanksList: state.thanksList ?? DEFAULT_DASHBOARD_STATE.thanksList,
    followUps: state.followUps ?? DEFAULT_DASHBOARD_STATE.followUps,
    events: state.events ?? DEFAULT_DASHBOARD_STATE.events,
    settings: state.settings ?? DEFAULT_DASHBOARD_STATE.settings,
  }
}

function normalizeApplicationRow(application: Omit<typeof adoptionApplications.$inferSelect, 'createdAt' | 'updatedAt'>): AdoptionApplication {
  return {
    ...application,
    petId: application.petId ?? '',
    applicantAddress: application.applicantAddress ?? '',
    applicantCity: application.applicantCity ?? '',
    customResponses: application.customResponses ?? undefined,
    documents: (application.documents ?? []).map((document) => ({ ...document, type: document.type as AdoptionApplicationDocument['type'] })),
    verification: application.verification ?? { identity: false, address: false, homeConditions: false, interview: false, references: false, eligibility: false },
    reviewNotes: application.reviewNotes ?? '',
    reviewedAt: application.reviewedAt ?? undefined,
  }
}

function normalizeFosterRow(home: Omit<typeof fosterHomes.$inferSelect, 'createdAt' | 'updatedAt'>): FosterHome {
  return {
    ...home,
    currentFosteredPet: home.currentFosteredPet ?? undefined,
    customResponses: home.customResponses ?? undefined,
  }
}

function normalizeSettingsRow(settings: Omit<typeof shelterSettings.$inferSelect, 'id' | 'updatedAt'>): ShelterSettings {
  return {
    ...settings,
    adoptionFormFields: settings.adoptionFormFields as CustomFormField[],
    fosterFormFields: settings.fosterFormFields as CustomFormField[],
  }
}

function normalizeFollowUpRow(followUp: Omit<typeof adoptionFollowUps.$inferSelect, 'createdAt' | 'updatedAt'>): AdoptionFollowUp {
  return {
    ...followUp,
    petId: followUp.petId ?? undefined,
    applicationId: followUp.applicationId ?? undefined,
    lastContactDate: followUp.lastContactDate ?? undefined,
    verificationStatus: (followUp.verificationStatus as AdoptionFollowUp['verificationStatus']) ?? 'Pendiente',
    followUpChecks: followUp.followUpChecks ?? { contacted: false, petSafe: false, healthUpToDate: false, conditionsMet: false },
    incidents: followUp.incidents ?? '',
  }
}

function normalizeEventRow(event: Omit<typeof shelterEvents.$inferSelect, 'createdAt' | 'updatedAt'>): ShelterEvent {
  return { ...event, image: event.image || '/events.png', latitude: event.latitude || 19.4326, longitude: event.longitude || -99.1332 }
}

export async function loadDashboardState() {
  const db = getDb()
  const [petsRows, applicationRows, fosterRows, thanksRows, followUpRows, eventRows, settingsRows] = await Promise.all([
    db.select().from(pets),
    db.select().from(adoptionApplications),
    db.select().from(fosterHomes),
    db.select().from(sponsorThanks),
    db.select().from(adoptionFollowUps),
    db.select().from(shelterEvents),
    db.select().from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
  ])

  return normalizeState({
    pets: petsRows.map(({ createdAt, updatedAt, ...pet }) => ({
      ...pet,
      images: pet.images?.length ? pet.images : [pet.image],
      featured: pet.featured ?? false,
    })),
    applications: applicationRows.map(({ createdAt, updatedAt, ...application }) => normalizeApplicationRow(application)),
    fosterHomes: fosterRows.map(({ createdAt, updatedAt, ...home }) => normalizeFosterRow(home)),
    thanksList: thanksRows.map(({ createdAt, updatedAt, ...thank }) => thank),
    followUps: followUpRows.map(({ createdAt, updatedAt, ...followUp }) => normalizeFollowUpRow(followUp)),
    events: eventRows.map(({ createdAt, updatedAt, ...event }) => normalizeEventRow(event)),
    settings: settingsRows[0]
      ? (() => {
          const { updatedAt, id, ...settings } = settingsRows[0]
          void updatedAt
          void id
          return normalizeSettingsRow(settings)
        })()
      : DEFAULT_DASHBOARD_STATE.settings,
  })
}

export async function saveDashboardState(state: DashboardState) {
  const db = getDb()
  await db.transaction(async (tx) => {
    await tx.delete(adoptionApplications)
    await tx.delete(fosterHomes)
    await tx.delete(sponsorThanks)
    await tx.delete(adoptionFollowUps)
    await tx.delete(shelterEvents)
    await tx.delete(pets)
    await tx.delete(shelterSettings)

    if (state.pets.length > 0) {
      await tx.insert(pets).values(state.pets.map((pet) => ({ ...pet, createdAt: new Date(), updatedAt: new Date() })))
    }

    if (state.applications.length > 0) {
      await tx.insert(adoptionApplications).values(state.applications.map((application) => ({ ...application, createdAt: new Date(), updatedAt: new Date() })))
    }

    if (state.fosterHomes.length > 0) {
      await tx.insert(fosterHomes).values(state.fosterHomes.map((home) => ({ ...home, createdAt: new Date(), updatedAt: new Date() })))
    }

    if (state.thanksList.length > 0) {
      await tx.insert(sponsorThanks).values(state.thanksList.map((thank) => ({ ...thank, createdAt: new Date(), updatedAt: new Date() })))
    }

    if (state.followUps.length > 0) {
      await tx.insert(adoptionFollowUps).values(state.followUps.map((followUp) => ({ ...followUp, createdAt: new Date(), updatedAt: new Date() })))
    }

    if (state.events.length > 0) {
      await tx.insert(shelterEvents).values(state.events.map((event) => ({ ...event, createdAt: new Date(), updatedAt: new Date() })))
    }

    await tx.insert(shelterSettings).values({
      id: 1,
      ...state.settings,
      updatedAt: new Date(),
    })
  })
}

export async function seedDashboardState() {
  // Seed only a completely empty database. Never replace existing user data
  // just because its IDs happen to use the same prefix as the demo records.
  if (!(await hasStoredDashboardData())) {
    await saveDashboardState(DEFAULT_DASHBOARD_STATE)
  }
}
