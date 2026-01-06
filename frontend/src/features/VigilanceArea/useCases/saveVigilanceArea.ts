import { ApiErrorCode } from '@api/types'
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

    const periodsWithComputedEndDate: VigilanceArea.VigilanceAreaPeriod[] | undefined = values.periods?.map(period => {
      const realEndDate = computeRealEndDate(period)
      const computedEndDate = realEndDate ?? undefined

      return { ...period, computedEndDate }
    })
    const vigilanceAreaToSave = { ...values, periods: periodsWithComputedEndDate }
    try {
      const response = await dispatch(vigilanceAreaEnpoint.initiate(vigilanceAreaToSave))

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
      } else if ('data' in response.error && response.error.data?.code === ApiErrorCode.UNVALID_PROPERTY) {
        throw Error('Une propriété est invalide')
      } else if (response.error) {
        throw Error('Une erreur est survenue lors de la création/sauvegarde de la zone de vigilance.')
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

const computeRealEndDate = (period: VigilanceArea.VigilanceAreaPeriod): string | undefined => {
  let currentOccurrence = customDayjs(period.startDatePeriod)

  const endDate = period.endDatePeriod ? customDayjs(period.endDatePeriod) : undefined
  const vigilanceAreaDurationInDays =
    period.startDatePeriod && period.endDatePeriod
      ? customDayjs(period.endDatePeriod).diff(period.startDatePeriod, 'days')
      : 0

  if (period.endingCondition === VigilanceArea.EndingCondition.NEVER) {
    return undefined
  }

  if (period.endingCondition === VigilanceArea.EndingCondition.END_DATE && period.endingOccurrenceDate) {
    const endingDate = customDayjs(period.endingOccurrenceDate)

    return endingDate.isAfter(endDate) ? endingDate.toISOString() : endDate?.toISOString()
  }

  if (period.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && period.endingOccurrencesNumber) {
    for (let i = 1; i < period.endingOccurrencesNumber; i += 1) {
      switch (period.frequency) {
        case VigilanceArea.Frequency.ALL_WEEKS:
          currentOccurrence = currentOccurrence.add(7, 'days')
          break
        case VigilanceArea.Frequency.ALL_MONTHS:
          currentOccurrence = currentOccurrence.add(1, 'month')
          break
        case VigilanceArea.Frequency.ALL_YEARS:
          currentOccurrence = currentOccurrence.add(1, 'year')
          break
        case VigilanceArea.Frequency.NONE:
          currentOccurrence = customDayjs(period.endDatePeriod)
          break
        default:
          return undefined // No recurrence
      }
    }

    return currentOccurrence.add(vigilanceAreaDurationInDays, 'days').isAfter(endDate)
      ? `${currentOccurrence.add(vigilanceAreaDurationInDays, 'days').format('YYYY-MM-DD')}T23:59:59.999Z`
      : endDate?.toISOString()
  }

  return endDate?.toISOString()
}
