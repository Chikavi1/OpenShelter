import type { ShelterSettings } from './dashboard-defaults'

export interface DonationMethod {
  id: 'transfer' | 'paypal'
  label: string
  desc: string
}

export function getDonationMethods(settings: ShelterSettings): DonationMethod[] {
  const methods: DonationMethod[] = []

  if (Boolean(settings.transferBankName && settings.transferClabe)) {
    methods.push({
      id: 'transfer',
      label: 'Transferencia bancaria',
      desc: 'Datos configurados',
    })
  }

  if (settings.paypalUrl) {
    methods.push({
      id: 'paypal',
      label: 'PayPal',
      desc: 'Usa el enlace configurado',
    })
  }

  return methods
}
