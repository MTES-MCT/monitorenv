import { Style } from 'ol/style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import { getColorWithAlpha } from '../../utils/utils'
import { COLORS } from '../../constants/constants'

export const regulatoryPreviewStyle = new Style({
  stroke: new Stroke({
    color: getColorWithAlpha(COLORS.charcoal, 0.75)
  }),
  fill: new Fill({
    color: getColorWithAlpha('#7B9FCC', 0.75)
  })
})
