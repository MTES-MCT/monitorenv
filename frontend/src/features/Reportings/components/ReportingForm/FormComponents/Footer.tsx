import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { ButtonWithWiteBg, StyledButton, StyledDeleteButton, StyledFooter } from '@features/Reportings/style'
import { archiveReporting } from '@features/Reportings/useCases/archiveReporting'
import { reopenReporting } from '@features/Reportings/useCases/reopenReporting'
import { getTimeLeft, isNewReporting } from '@features/Reportings/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, customDayjs, getLocalizedDayjs, Icon, IconButton, Level, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { formatCoordinatesAsText } from '@utils/coordinates'
import { getReportingStatus, type Reporting, ReportingStatusEnum } from 'domain/entities/reporting'
import { ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import { ReportingContext } from 'domain/shared_slices/Global'
import { useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { getCenter } from 'ol/extent'
import { MultiPolygon } from 'ol/geom'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useGetHistoryOfInfractions } from '../hooks/useGetHistoryOfInfractions'

import type { Coordinate } from 'ol/coordinate'

type ReportingFooterProps = {
  isAutoSaveEnabled: boolean
  onClose: () => void
  onDelete: () => void
  onSave: () => void
  setMustIncreaseValidity: (value: boolean) => void
}

export function Footer({
  isAutoSaveEnabled,
  onClose,
  onDelete,
  onSave,
  setMustIncreaseValidity
}: ReportingFooterProps) {
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const reportingContext =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId]?.context : undefined)) ??
    ReportingContext.MAP
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat)

  const dispatch = useAppDispatch()
  const { setFieldValue, validateForm, values } = useFormikContext<Reporting>()
  const getHistoryByMmsi = useGetHistoryOfInfractions()

  const reportingStatus = getReportingStatus(values)

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const checkFormValidity = async () => {
      const validateFormResult = await validateForm()
      setIsFormValid(isEmpty(validateFormResult))
    }

    checkFormValidity()
    // we need to ccke values change to update the form validity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const handleReopen = () => {
    const endOfValidity = getLocalizedDayjs(values?.createdAt ?? customDayjs().toISOString()).add(
      values?.validityTime ?? 0,
      'hour'
    )
    const timeLeft = getTimeLeft(endOfValidity)

    if (timeLeft < 0) {
      setMustIncreaseValidity(true)

      return
    }
    setMustIncreaseValidity(false)

    validateForm({ ...values, isArchived: false }).then(async errors => {
      if (!isEmpty(errors)) {
        return
      }
      setFieldValue('isArchived', false)
      dispatch(reopenReporting({ ...values, isArchived: false }, reportingContext))
    })
  }

  const handleArchive = async () => {
    if (!values.id) {
      return
    }
    dispatch(archiveReporting(Number(values.id), reportingContext, true))
  }

  const copyTargetInfos = async () => {
    const isMultiPoint = values.geom?.type === 'MultiPoint'
    const isMultiPolygon = values.geom?.type === 'MultiPolygon'

    const coordinates = values.geom?.coordinates
    let formattedCoordinates: string | undefined
    if (isMultiPoint && coordinates) {
      formattedCoordinates = formatCoordinatesAsText(coordinates[0] as Coordinate, coordinatesFormat)
    }

    if (isMultiPolygon && coordinates && coordinates[0]) {
      const multiPolygon = new MultiPolygon(coordinates as Coordinate[][][])
      const centroid = getCenter(multiPolygon.getExtent())
      formattedCoordinates = `${formatCoordinatesAsText(
        centroid as Coordinate,
        coordinatesFormat
      )} (calculées depuis le centroïde de la zone du signalement)`
    }

    const globalInfos = [
      `Réponse VHF: ${values.withVHFAnswer ? 'Oui' : 'Non'}`,
      `${formattedCoordinates ? `Localisation: ${formattedCoordinates}\n` : ''}`
    ].join('\n')

    const targetDetails = () =>
      Promise.all(
        values.targetDetails.map(async target => {
          const targetInfos = `${target.vesselName ? `Nom du navire:${target.vesselName}\n` : ''}${
            target.mmsi ? `MMSI: ${target.mmsi}\n` : ''
          }${target.size ? `Taille: ${target.size}m\n` : ''}`

          if (!target.mmsi) {
            return ''
          }

          const history = await getHistoryByMmsi({
            mmsi: target.mmsi,
            reportingId: values.id
          })

          const totalSuspicionOfInfractions = history?.suspicionOfInfractions.length ?? 0

          let targetHistory
          if (totalSuspicionOfInfractions === 0 && history?.totalInfraction === 0) {
            targetHistory = 'Pas d’antécédent'
          } else {
            targetHistory = `Antécédents: ${totalSuspicionOfInfractions} ${pluralize(
              'signalement',
              totalSuspicionOfInfractions
            )}, ${history?.totalInfraction} ${pluralize('infraction', history?.totalInfraction ?? 0)}, ${
              history?.totalPV ?? 0
            } PV\n`
          }

          return `${targetInfos}${globalInfos}${targetHistory}`
        })
      )

    const alltargetDetails = await targetDetails()
    const formattedTargetDetails = alltargetDetails.join('\n')

    navigator.clipboard
      .writeText(formattedTargetDetails)
      .then(() => {
        const bannerProps = {
          children:
            'Signalement copié dans le presse papier (Nom du navire, MMSI, taille, localisation, réponse VHF, antécédents)',
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        }

        return dispatch(addMainWindowBanner(bannerProps))
      })
      .catch(() => {
        const errorBannerProps = {
          children: "Les infos du signalement n'ont pas pu être copiés dans le presse papier",
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        }

        return dispatch(addMainWindowBanner(errorBannerProps))
      })
  }

  if (isNewReporting(values.id)) {
    return (
      <StyledFooter $justify="end">
        <ButtonWithWiteBg accent={Accent.SECONDARY} onClick={onClose}>
          Fermer
        </ButtonWithWiteBg>
      </StyledFooter>
    )
  }

  return (
    <StyledFooter>
      <div>
        <StyledDeleteButton
          accent={Accent.SECONDARY}
          color={THEME.color.maximumRed}
          Icon={Icon.Delete}
          onClick={onDelete}
          title="Supprimer le signalement"
        />
        {reportingContext === ReportingContext.MAP && (
          <StyledIconButton
            disabled={
              values.targetType !== ReportingTargetTypeEnum.VEHICLE || values.vehicleType !== VehicleTypeEnum.VESSEL
            }
            Icon={Icon.Duplicate}
            onClick={copyTargetInfos}
            title="Copier le nom du navire, le MMSI, la taille, la localisation, et la réponse VHF"
          />
        )}
      </div>

      <div>
        {reportingStatus === ReportingStatusEnum.ARCHIVED || values.isArchived ? (
          <StyledButton Icon={Icon.Unlock} onClick={handleReopen}>
            Rouvrir le signalement
          </StyledButton>
        ) : (
          <StyledButton disabled={!isFormValid} Icon={Icon.Archive} onClick={handleArchive}>
            Archiver
          </StyledButton>
        )}
        {isAutoSaveEnabled ? (
          <ButtonWithWiteBg accent={Accent.SECONDARY} data-cy="close-reporting" onClick={onClose}>
            Fermer
          </ButtonWithWiteBg>
        ) : (
          <ButtonWithWiteBg accent={Accent.SECONDARY} data-cy="save-reporting" Icon={Icon.Save} onClick={onSave}>
            Enregistrer et quitter
          </ButtonWithWiteBg>
        )}
      </div>
    </StyledFooter>
  )
}

export const StyledIconButton = styled(IconButton)`
  border: 1px solid ${p => p.theme.color.white};
  margin-left: 8px;
`
