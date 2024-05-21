import { describe, expect, it } from '@jest/globals'

import { getIconStyle, getInterestPointStyle, getStrokeStyles } from './interestPoint.style'

describe('getInterestPointStyle', () => {
  it('should return stroke style when it should style it', async () => {
    // Given
    const shouldStyleStroke = true
    const dummyResolution = 1

    // When
    const strokeStyle = getInterestPointStyle(shouldStyleStroke, dummyResolution)

    // Then
    const styleExpected = getStrokeStyles()

    expect(strokeStyle).toEqual(styleExpected)
  })
  it('should return a icon', async () => {
    // Given
    const shouldStyleStroke = false
    const dummyResolution = 1

    // When
    const strokeStyle = getInterestPointStyle(shouldStyleStroke, dummyResolution)

    // Then
    const styleExpected = getIconStyle(dummyResolution)

    expect(styleExpected).toEqual(strokeStyle)
  })
})
