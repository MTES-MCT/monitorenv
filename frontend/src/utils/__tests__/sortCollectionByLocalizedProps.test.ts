/* eslint-disable sort-keys-fix/sort-keys-fix */

import { describe, expect, it } from '@jest/globals'

import { sortCollectionByLocalizedProps } from '../sortCollectionByLocalizedProps'

function randomizeArrayOrder(array) {
  return array.sort(() => Math.random() - 0.5)
}

describe('sortCollectionByLocalizedProps', () => {
  it('should sort by multiple property paths', () => {
    const propPaths = ['name.last', 'name.first']
    const collection = randomizeArrayOrder([
      { name: { last: 'Z', first: 'B' } },
      { name: { last: 'Z', first: 'A' } },
      { name: { last: 'É', first: 'B' } },
      { name: { last: 'É', first: 'A' } },
      { name: { last: 'E', first: 'B' } },
      { name: { last: 'E', first: 'A' } },
      { name: { last: 'A', first: 'B' } },
      { name: { last: 'A', first: 'A' } }
    ])

    const result = sortCollectionByLocalizedProps(propPaths, collection)

    expect(result).toStrictEqual([
      { name: { last: 'A', first: 'A' } },
      { name: { last: 'A', first: 'B' } },
      { name: { last: 'E', first: 'A' } },
      { name: { last: 'E', first: 'B' } },
      { name: { last: 'É', first: 'A' } },
      { name: { last: 'É', first: 'B' } },
      { name: { last: 'Z', first: 'A' } },
      { name: { last: 'Z', first: 'B' } }
    ])
  })
})
