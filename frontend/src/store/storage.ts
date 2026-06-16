import createWebStorage from 'redux-persist/es/storage/createWebStorage'

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  removeItem: () => Promise.resolve(),
  setItem: (_key: string, value: unknown) => Promise.resolve(value)
})

export const storage = typeof globalThis.window === 'undefined' ? createNoopStorage() : createWebStorage('local')
