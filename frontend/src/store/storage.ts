import createWebStorage from 'redux-persist/es/storage/createWebStorage'

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  removeItem: () => Promise.resolve(),
  setItem: (_key: string, value: unknown) => Promise.resolve(value)
})

export const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()
