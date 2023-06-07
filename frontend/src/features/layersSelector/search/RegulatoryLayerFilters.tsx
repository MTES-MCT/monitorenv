import { Button } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { FilterTagPicker } from '../../../uiMonitor/CustomRsuite/FilterTagPicker'

export function RegulatoryLayerFilters({ filteredRegulatoryThemes, regulatoryThemes, setFilteredRegulatoryThemes }) {
  const handleResetFilters = () => {
    setFilteredRegulatoryThemes([])
  }

  return (
    <FiltersWrapper>
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
`
const ResetFilters = styled(Button)`
  padding: 0px;
`
