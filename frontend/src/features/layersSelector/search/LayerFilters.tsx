import { Checkbox } from '@mtes-mct/monitor-ui'
import { Button } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { FilterTagPicker } from '../../../uiMonitor/CustomRsuite/FilterTagPicker'

export function RegulatoryLayerFilters({
  filteredRegulatoryThemes,
  regulatoryThemes,
  setFilteredRegulatoryThemes,
  setShouldSearchAMPs,
  setShouldSearchRegulatory,
  shouldSearchAMPs,
  shouldSearchRegulatory
}) {
  const handleResetFilters = () => {
    setFilteredRegulatoryThemes([])
  }

  return (
    <FiltersWrapper>
      <Checkbox
        checked={shouldSearchRegulatory}
        label="Zones avec une réglementation"
        name="shouldSearchRegulatory"
        onChange={setShouldSearchRegulatory}
      />
      <Checkbox
        checked={shouldSearchAMPs}
        label="Zones dans une AMP"
        name="shouldSearchAMPs"
        onChange={setShouldSearchAMPs}
      />
      <FilterTagPicker
        block
        data={regulatoryThemes}
        onChange={setFilteredRegulatoryThemes}
        placeholder="Thématiques de contrôle"
        searchable
        value={filteredRegulatoryThemes}
      />
      {filteredRegulatoryThemes?.length > 0 && (
        <ResetFilters appearance="link" onClick={handleResetFilters}>
          Réinitialiser les filtres
        </ResetFilters>
      )}
    </FiltersWrapper>
  )
}

const FiltersWrapper = styled.div`
  background-color: ${COLORS.white};
  padding: 16px;
  text-align: left;
  border-top: 2px solid ${COLORS.lightGray};
  > .Field-Checkbox:not(:first-child) {
    margin-top: 10px;
  }
`
const ResetFilters = styled(Button)`
  padding: 0px;
`
