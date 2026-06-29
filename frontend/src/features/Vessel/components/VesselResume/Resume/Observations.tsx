import { VesselIdentity } from '@features/Vessel/components/VesselResume/styles'
import { Vessel } from '@features/Vessel/types'
import { saveVesselAdditionalInformation } from '@features/Vessel/useCases/saveVesselAdditionalInformation'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Textarea } from '@mtes-mct/monitor-ui'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

type AdditionalInformationProps = {
  vessel: Vessel.Vessel
}

export function AdditionalInformation({ vessel }: AdditionalInformationProps) {
  const dispatch = useAppDispatch()
  const [observations, setObservations] = useState(vessel.additionalInformation?.observations)

  useEffect(() => {
    setObservations(vessel.additionalInformation?.observations)
  }, [vessel.additionalInformation?.observations])

  const onChange = (nextObservations: string | undefined) => {
    setObservations(nextObservations)
    save(nextObservations)
  }

  const save = useDebouncedCallback((nextObservations: string | undefined) => {
    const vesselId: Vessel.VesselId = {
      batchId: vessel.batchId,
      rowNumber: vessel.rowNumber,
      shipId: vessel.shipId
    }
    const additionalInformationToSave: Vessel.AdditionalInformation = {
      id: vessel.additionalInformation?.id,
      observations: nextObservations
    }
    dispatch(saveVesselAdditionalInformation(vesselId, additionalInformationToSave))
  }, 500)

  return (
    <Observations>
      <Textarea label="Observations" name="observations" onChange={onChange} value={observations} />
    </Observations>
  )
}

const Observations = styled(VesselIdentity)`
  grid-template-columns: 1fr;
`
