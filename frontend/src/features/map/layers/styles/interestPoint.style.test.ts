import { describe, expect, it } from '@jest/globals'
import { THEME } from '@mtes-mct/monitor-ui'
import { Icon, Stroke, Style } from 'ol/style'

import { getInterestPointStyle } from './interestPoint.style'
import {
  INTEREST_POINT_STYLE_ICON_FILENAME,
  INTEREST_POINT_STYLE_ZINDEX
} from '../../../../domain/entities/interestPoints'

describe('getInterestPointStyle', () => {
  it('should return stroke style when it should style it', async () => {
    // Given
    const shouldStyleStroke = true
    const dummyResolution = 1

    // When
    const strokeStyle = getInterestPointStyle(shouldStyleStroke, dummyResolution)

    // Then
    const styleExpected = [
      new Style({
        stroke: new Stroke({
          color: THEME.color.slateGray,
          lineDash: [4, 4],
          width: 2
        })
      })
    ]

    expect(strokeStyle).toEqual(styleExpected)
  })
  it('should return a icon', async () => {
    // Given
    const shouldStyleStroke = false
    const dummyResolution = 1

    // When
    const strokeStyle = getInterestPointStyle(shouldStyleStroke, dummyResolution)

    // Then
    const styleExpected = new Style({
      image: new Icon({
        offset: [0, 0],
        scale: 1 / dummyResolution ** (1 / 8) + 0.3,
        size: [30, 79],
        src: INTEREST_POINT_STYLE_ICON_FILENAME
      }),
      zIndex: INTEREST_POINT_STYLE_ZINDEX
    })

    expect(styleExpected).toEqual(strokeStyle)
  })
})
