'use client'

import { useState } from 'react'

interface CountryOption {
  code: string
  flag: string
  dial: string
}

const countries: CountryOption[] = [
  { code: 'MX', flag: '🇲🇽', dial: '+52' },
  { code: 'US', flag: '🇺🇸', dial: '+1' },
  { code: 'CA', flag: '🇨🇦', dial: '+1' },
  { code: 'CO', flag: '🇨🇴', dial: '+57' },
  { code: 'AR', flag: '🇦🇷', dial: '+54' },
  { code: 'ES', flag: '🇪🇸', dial: '+34' },
]

interface PhoneInputProps {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function PhoneInput({ label, name, placeholder = 'Número de teléfono', required = false, value = '', onChange }: PhoneInputProps) {
  const [internalValue, setInternalValue] = useState(value)
  const currentValue = onChange ? value : internalValue
  const [uncontrolledCountry, setUncontrolledCountry] = useState(countries[0].code)
  const selectedCountry = onChange
    ? countries.find((country) => currentValue.startsWith(country.dial)) ?? countries[0]
    : countries.find((country) => country.code === uncontrolledCountry) ?? countries[0]
  const number = currentValue.startsWith(selectedCountry.dial) ? currentValue.slice(selectedCountry.dial.length).trim() : currentValue

  const updateValue = (dial: string, nextNumber: string) => {
    const sanitizedNumber = nextNumber.replace(/\D/g, '').slice(0, 15)
    const nextValue = `${dial} ${sanitizedNumber}`.trim()
    if (onChange) onChange(nextValue)
    else setInternalValue(nextValue)
  }

  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium">
      {label}
      <span className="flex min-h-12 min-w-0 overflow-hidden rounded-xl border border-foreground/15 bg-background transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <select
          aria-label="País"
          value={selectedCountry.code}
          onChange={(event) => {
            const country = countries.find((item) => item.code === event.target.value) ?? countries[0]
            setUncontrolledCountry(country.code)
            updateValue(country.dial, number)
          }}
          className="w-[4.75rem] appearance-none border-r border-foreground/10 bg-transparent px-3 text-sm outline-none"
        >
          {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.dial}</option>)}
        </select>
        <input
          required={required}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="tel"
          value={number}
          onChange={(event) => updateValue(selectedCountry.dial, event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <input type="hidden" name={name} value={currentValue} />
      </span>
    </label>
  )
}
