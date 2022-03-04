import React from 'react'
import { useSelector } from 'react-redux'
import { Section, SectionTitle } from './RegulatoryMetadata.style'
import { RedCircle, GreenCircle } from '../../../commonStyles/Circle.style'
import { fishingPeriodToString } from '../../../../domain/entities/regulatory'

const MetadataFishingPeriod = () => {
  const { fishingPeriod } = useSelector(state => state.regulatory.regulatoryZoneMetadata)

  return <>{fishingPeriod && fishingPeriod.authorized !== undefined &&
    <Section>
      <SectionTitle>{fishingPeriod.authorized
        ? <GreenCircle margin={'0 5px 0 0'} />
        : <RedCircle margin={'0 5px 0 0'} />}
      Période de pêche {fishingPeriod.authorized ? 'autorisée' : 'interdites'}</SectionTitle>
      {fishingPeriodToString(fishingPeriod)}
    </Section>}</>
}

export default MetadataFishingPeriod
