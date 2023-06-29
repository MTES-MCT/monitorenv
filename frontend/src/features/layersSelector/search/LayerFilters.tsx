import { SingleTag } from '@mtes-mct/monitor-ui'
import { Button, CheckPicker } from 'rsuite'
import styled from 'styled-components'

export function LayerFilters({ filteredRegulatoryThemes, regulatoryThemes, setFilteredRegulatoryThemes }) {
  const handleResetFilteredRegulatoryThemes = () => {
    setFilteredRegulatoryThemes([])
  }

  const handleSetFilteredRegulatoryThemes = v => {
    setFilteredRegulatoryThemes(v)
  }

  const handleDeleteRegulatoryTheme = v => () => {
    setFilteredRegulatoryThemes(filteredRegulatoryThemes.filter(theme => theme !== v))
  }

  return (
    <FiltersWrapper>
      <StyledCheckPicker
        data={regulatoryThemes}
        labelKey="label"
        onChange={handleSetFilteredRegulatoryThemes}
        placeholder="Thématique Réglementaire"
        renderValue={() =>
          filteredRegulatoryThemes && (
            <OptionValue>{`Thématique Réglementaire (${filteredRegulatoryThemes.length})`}</OptionValue>
          )
        }
        size="sm"
        value={filteredRegulatoryThemes}
        valueKey="value"
      />
      <TagWrapper>
        {filteredRegulatoryThemes.length > 0 &&
          filteredRegulatoryThemes.map(theme => (
            <StyledSingleTag key={theme} onDelete={handleDeleteRegulatoryTheme(theme)}>
              {theme}
            </StyledSingleTag>
          ))}
      </TagWrapper>

      <StyledCheckPicker
        data={regulatoryThemes}
        labelKey="label"
        onChange={handleSetFilteredRegulatoryThemes}
        placeholder="Type d'AMP"
        renderValue={() =>
          filteredRegulatoryThemes && <OptionValue>{`Type d'AMP (${filteredRegulatoryThemes.length})`}</OptionValue>
        }
        size="sm"
        value={filteredRegulatoryThemes}
        valueKey="value"
      />
      <TagWrapper>
        {filteredRegulatoryThemes.length > 0 &&
          filteredRegulatoryThemes.map(theme => (
            <StyledSingleTag key={theme} onDelete={handleDeleteRegulatoryTheme(theme)}>
              {theme}
            </StyledSingleTag>
          ))}
      </TagWrapper>
      {filteredRegulatoryThemes?.length > 0 && (
        <ResetFilters appearance="link" onClick={handleResetFilteredRegulatoryThemes}>
          Réinitialiser les filtres
        </ResetFilters>
      )}
    </FiltersWrapper>
  )
}

const FiltersWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  padding: 16px;
  text-align: left;
  border-top: 2px solid ${p => p.theme.color.lightGray};
`
const TagWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`
const ResetFilters = styled(Button)`
  padding: 0px;
`

const StyledCheckPicker = styled(CheckPicker)`
  width: 100%;
  .rs-picker-toggle {
    background-color: ${p => p.theme.color.white} !important;
  }
  .rs-picker-toggle-placeholder {
    font-size: 13px !important;
  }
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledSingleTag = styled(SingleTag)`
  > * {
    background-color: ${p => p.theme.color.blueYonder['100']};
    color: ${p => p.theme.color.white};
  }
  .Element-IconButton:hover {
    background-color: ${p => p.theme.color.blueYonder['25']};
  }
`
