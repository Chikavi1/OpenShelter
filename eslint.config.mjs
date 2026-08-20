import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/public/uploads/**'],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default config
