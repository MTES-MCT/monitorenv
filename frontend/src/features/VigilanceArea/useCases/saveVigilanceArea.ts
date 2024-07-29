import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'

import { vigilanceAreaActions } from '../slice'
import { VigilanceArea } from '../types'

import type { HomeAppThunk } from '@store/index'

export const saveVigilanceArea =
  (values: VigilanceArea.VigilanceArea, isPublished?: boolean): HomeAppThunk =>
  async dispatch => {
    const isNewVigilanceArea = !values.id
    const vigilanceAreaEnpoint = isNewVigilanceArea
      ? vigilanceAreasAPI.endpoints.createVigilanceArea
      : vigilanceAreasAPI.endpoints.updateVigilanceArea

    const realEndDate = calculateRealEndDate(values)
    const computedEndDate = realEndDate ? realEndDate.toISOString() : undefined

    try {
      const response = await dispatch(vigilanceAreaEnpoint.initiate({ ...values, computedEndDate }))

      if ('data' in response) {
        const vigilanceAreaResponse = response.data as VigilanceArea.VigilanceArea
        const isVigilanceAreaPublic = vigilanceAreaResponse.visibility === VigilanceArea.Visibility.PUBLIC

        dispatch(vigilanceAreaActions.setEditingVigilanceAreaId(undefined))
        if (isNewVigilanceArea) {
          dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(vigilanceAreaResponse.id))
        }

        if (isNewVigilanceArea && !isPublished) {
          dispatch(
            addMainWindowBanner({
              children: 'La zone de vigilance a bien été créée',
              closingDelay: 10000,
              isClosable: true,
              isFixed: true,
              level: Level.SUCCESS,
              withAutomaticClosing: true
            })
          )

          return
        }

        if (isPublished) {
          dispatch(
            addMainWindowBanner({
              children: `La zone de vigilance a bien été publiée et est maintenant visible par ${
                isVigilanceAreaPublic ? 'tous' : 'le CACEM'
              }.`,
              closingDelay: 10000,
              isClosable: true,
              isFixed: true,
              level: Level.SUCCESS,
              withAutomaticClosing: true
            })
          )
        }
      }
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: `Une erreur est survenue lors de la création/sauvegarde de la zone de vigilance.`,
          closingDelay: 10000,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }

const calculateRealEndDate = area => {
  let currentOccurrence = customDayjs(area.startDatePeriod)
  const endDate = area.endDatePeriod ? customDayjs(area.endDatePeriod) : undefined

  if (area.frequency === VigilanceArea.Frequency.NONE) {
    return undefined
  }

  if (area.endingCondition === VigilanceArea.EndingCondition.END_DATE && area.endingOccurrenceDate) {
    const endingDate = customDayjs(area.endingOccurrenceDate)

    return endingDate.isAfter(endDate) ? endingDate : endDate
  }

  if (area.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && area.endingOccurrencesNumber) {
    switch (area.frequency) {
      case VigilanceArea.Frequency.ALL_WEEKS:
        currentOccurrence = currentOccurrence.add(area.endingOccurrencesNumber * 7, 'days')
        break
      case VigilanceArea.Frequency.ALL_MONTHS:
        currentOccurrence = currentOccurrence.add(area.endingOccurrencesNumber, 'month')
        break
      case VigilanceArea.Frequency.ALL_YEARS:
        currentOccurrence = currentOccurrence.add(area.endingOccurrencesNumber, 'year')
        break
      case VigilanceArea.Frequency.NONE:
      default:
        return false // No recurrence
    }

    return currentOccurrence.isAfter(endDate) ? currentOccurrence : endDate
  }

  return endDate
}
