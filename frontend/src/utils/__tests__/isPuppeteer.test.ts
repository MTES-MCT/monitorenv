import { beforeAll, describe, expect } from '@jest/globals'

import { isPuppeteer } from '../isPuppeteer'

describe('isPuppeteer()', () => {
  const localStorageMock = (() => {
    let store = {}

    return {
      clear() {
        store = {}
      },
      getItem(key) {
        return store[key] || null
      },
      setItem(key, value) {
        store[key] = value.toString()
      }
    }
  })()

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  it('should return TRUE when `IS_PUPPETEER` LocalStorage key is "true"', () => {
    localStorage.setItem('IS_PUPPETEER', 'true')

    const result = isPuppeteer()

    expect(result).toBe(true)
  })

  it('should return FALSE when `IS_PUPPETEER` LocalStorage key is missing', () => {
    const result = isPuppeteer()

    expect(result).toBe(false)
  })
})
