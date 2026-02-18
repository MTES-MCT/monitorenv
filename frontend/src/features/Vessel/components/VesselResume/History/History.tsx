import { HistoryOfInfractions } from '@features/Reportings/components/ReportingForm/FormComponents/Target/HistoryOfInfractions'
import { addReporting } from '@features/Reportings/useCases/addReporting'
import { HistoryTimeline } from '@features/Vessel/components/VesselResume/History/HistoryTimeline'
import { ReportingCard } from '@features/Vessel/components/VesselResume/History/ReportingCard'
import { toEvent } from '@features/Vessel/components/VesselResume/utils'
import { Vessel } from '@features/Vessel/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Button, customDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingTargetTypeEnum } from '../../../../../domain/entities/targetType'
import { VehicleTypeEnum } from '../../../../../domain/entities/vehicleType'
import { VesselTypeEnum } from '../../../../../domain/entities/vesselType'
import { ReportingContext } from '../../../../../domain/shared_slices/Global'

import type { EnvActionControlWithInfractions } from '../../../../../domain/entities/missions'
import type { Reporting } from '../../../../../domain/entities/reporting'

type SummaryProps = {
  envActions: EnvActionControlWithInfractions[]
  reportings: Reporting[]
  vessel: Vessel.Vessel
}

export function History({ envActions, reportings, vessel }: SummaryProps) {
  const dispatch = useAppDispatch()
  const currentYear = customDayjs().year()
  const diff = currentYear - 2023

  const currentReportings = reportings.filter(reporting =>
    customDayjs().isBefore(customDayjs(reporting.createdAt).add(reporting.validityTime, 'hours'))
  )

  const createReporting = () => {
    let vesselType: VesselTypeEnum | undefined
    if (vessel.category === 'PLA' && vessel.leisureType) {
      vesselType = VesselTypeEnum[vessel.leisureType]
    }

    if (vessel.category === 'PRO' && vessel.professionalType) {
      vesselType = VesselTypeEnum[vessel.professionalType]
    }
    const reportingWithTarget: Partial<Reporting> = {
      targetDetails: [
        {
          externalReferenceNumber: vessel.immatriculation,
          imo: vessel.imo,
          mmsi: vessel.mmsi,
          size: vessel.length,
          vesselName: vessel.shipName,
          vesselType
        }
      ],
      targetType: ReportingTargetTypeEnum.VEHICLE,
      vehicleType: VehicleTypeEnum.VESSEL
    }
    dispatch(addReporting(ReportingContext.MAP, reportingWithTarget))
  }

  return (
    <Wrapper>
      <Section>
        <header>Derniers contrôles et signalements ({diff} dernières années)</header>
        <Body>
          <HistoryOfInfractions forceSearch mmsi={vessel.mmsi} />
          <CurrentReportingWrapper>
            <Button isFullWidth onClick={createReporting}>
              Ajouter un signalement
            </Button>
            {currentReportings.map(currentReporting => (
              <li key={currentReporting.id}>
                <ReportingCard reporting={toEvent(currentReporting)} />
              </li>
            ))}
          </CurrentReportingWrapper>
        </Body>
      </Section>
      <Section>
        <HistoryTimeline envActions={envActions} reportings={reportings} />
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Section = styled.section`
  header {
    background-color: ${p => p.theme.color.lightGray};
    padding: 10px 20px;
    color: ${p => p.theme.color.slateGray};
    font-weight: 500;
  }

  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
`

const Body = styled.div`
  padding: 16px 20px;
`

const CurrentReportingWrapper = styled.ol`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
`
