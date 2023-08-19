import { expect } from '@jest/globals'

import { getOptionsFromIdAndName } from '../getOptionsFromIdAndName'

describe('utils/getOptionsFromIdAndName()', () => {
  it('should return the expected array of options', () => {
    const collection = [
      {
        id: 1,
        name: 'One'
      },
      {
        id: 2,
        name: 'Two'
      }
    ]

    const result = getOptionsFromIdAndName(collection)

    expect(result).toStrictEqual([
      {
        label: 'One',
        value: 1
      },
      {
        label: 'Two',
        value: 2
      }
    ])
  })

  it('should return undefined with an undefined collection', () => {
    const collection = undefined

    const result = getOptionsFromIdAndName(collection)

    expect(result).toBeUndefined()
  })
})
