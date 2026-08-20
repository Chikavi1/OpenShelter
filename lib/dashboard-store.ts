import { eq } from 'drizzle-orm'
import { getDb } from './db/client'
import { adoptionApplications, fosterHomes, pets, shelterSettings, sponsorThanks } from './db/schema'
import {
  DEFAULT_DASHBOARD_STATE,
  type AdoptionApplication,
  type CustomFormField,
  type DashboardState,
  type FosterHome,
  type ShelterSettings,
} from './dashboard-defaults'

function isLegacySeedId(id: string) {
  return id.startsWith('pet-') || id.startsWith('sol-') || id.startsWith('fh-') || id.startsWith('th-')
}

async function hasLegacySeedData() {
  const db = getDb()
  const [petRows, applicationRows, fosterRows, thanksRows, settingsRows] = await Promise.all([
    db.select({ id: pets.id }).from(pets).limit(1),
    db.select({ id: adoptionApplications.id }).from(adoptionApplications).limit(1),
    db.select({ id: fosterHomes.id }).from(fosterHomes).limit(1),
    db.select({ id: sponsorThanks.id }).from(sponsorThanks).limit(1),
    db.select({ name: shelterSettings.name }).from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
  ])

  return [
    petRows[0]?.id,
    applicationRows[0]?.id,
    fosterRows[0]?.id,
    thanksRows[0]?.id,
  ].some((id) => Boolean(id && isLegacySeedId(id))) || settingsRows[0]?.name === 'Refugio Huellas' || settingsRows[0]?.name === 'Key Rescata'
}

function normalizeState(state: Partial<DashboardState>): DashboardState {
  return {
    pets: state.pets ?? DEFAULT_DASHBOARD_STATE.pets,
    applications: state.applications ?? DEFAULT_DASHBOARD_STATE.applications,
    fosterHomes: state.fosterHomes ?? DEFAULT_DASHBOARD_STATE.fosterHomes,
    thanksList: state.thanksList ?? DEFAULT_DASHBOARD_STATE.thanksList,
    settings: state.settings ?? DEFAULT_DASHBOARD_STATE.settings,
  }
}

function normalizeApplicationRow(application: Omit<typeof adoptionApplications.$inferSelect, 'createdAt' | 'updatedAt'>): AdoptionApplication {
  return {
    ...application,
    petId: application.petId ?? '',
    customResponses: application.customResponses ?? undefined,
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

export async function loadDashboardState() {
  const db = getDb()
  const [petsRows, applicationRows, fosterRows, thanksRows, settingsRows] = await Promise.all([
    db.select().from(pets),
    db.select().from(adoptionApplications),
    db.select().from(fosterHomes),
    db.select().from(sponsorThanks),
    db.select().from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
  ])

  return normalizeState({
    pets: petsRows.map(({ createdAt, updatedAt, ...pet }) => pet),
    applications: applicationRows.map(({ createdAt, updatedAt, ...application }) => normalizeApplicationRow(application)),
    fosterHomes: fosterRows.map(({ createdAt, updatedAt, ...home }) => normalizeFosterRow(home)),
    thanksList: thanksRows.map(({ createdAt, updatedAt, ...thank }) => thank),
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

    await tx.insert(shelterSettings).values({
      id: 1,
      ...state.settings,
      updatedAt: new Date(),
    })
  })
}

export async function seedDashboardState() {
  if (await hasLegacySeedData()) {
    await saveDashboardState(DEFAULT_DASHBOARD_STATE)
  }
}
