import { getIsLinkingAMPToVigilanceArea, getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { useAppSelector } from '@hooks/useAppSelector'
import { type Option, Accent, CheckPicker, CustomSearch, Icon, SingleTag, THEME } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

type LayerFiltersProps = {
  ampTypes: Option<string>[]
  filteredAmpTypes: string[]
  filteredRegulatoryThemes: string[]
  handleResetFilters: () => void
  regulatoryThemes: Option<string>[]
  setFilteredAmpTypes: (filteredAmpTypes: string[]) => void
  setFilteredRegulatoryThemes: (filteredRegulatoryThemes: string[]) => void
}

enum TooltipTypeVisible {
  AMP_THEMES = 'AMP_THEMES',
  REGULATORY_THEMES = 'REGULATORY_THEMES'
}
export function LayerFilters({
  ampTypes,
  filteredAmpTypes,
  filteredRegulatoryThemes,
  handleResetFilters,
  regulatoryThemes,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes
}: LayerFiltersProps) {
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const [visibleTooltipType, setVisibleTooltipType] = useState<TooltipTypeVisible | undefined>(undefined)

  const showTooltip = type => setVisibleTooltipType(type)
  const hideTooltip = () => setVisibleTooltipType(undefined)

  const handleSetFilteredAmpTypes = filteredAmps => {
    setFilteredAmpTypes(filteredAmps)
  }

  const handleDeleteAmpType = v => () => {
    setFilteredAmpTypes(filteredAmpTypes.filter(theme => theme !== v))
  }
  const handleSetFilteredRegulatoryThemes = v => {
    setFilteredRegulatoryThemes(v)
  }

  const handleDeleteRegulatoryTheme = v => () => {
    setFilteredRegulatoryThemes(filteredRegulatoryThemes.filter(theme => theme !== v))
  }

  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemes as Array<Option>, ['label']),
    [regulatoryThemes]
  )

  const AMPCustomSearch = useMemo(() => new CustomSearch(ampTypes as Array<Option>, ['label']), [ampTypes])

  return (
    <FiltersWrapper>
      {!isLinkingAmpToVigilanceArea && (
        <>
          <CheckPickerContainer>
            <StyledCheckPicker
              customSearch={regulatoryThemesCustomSearch}
              isLabelHidden
              isTransparent
              label="Thématique réglementaire"
              name="regulatoryThemes"
              onChange={handleSetFilteredRegulatoryThemes}
              options={regulatoryThemes || []}
              placeholder="Thématique réglementaire"
              renderValue={() =>
                filteredRegulatoryThemes && (
                  <OptionValue>{`Thématique réglementaire (${filteredRegulatoryThemes.length})`}</OptionValue>
                )
              }
              value={filteredRegulatoryThemes}
            />
            <IconAndMessageWrapper>
              <StyledIconAttention
                aria-describedby="regulatoryThemesTooltip"
                color={THEME.color.slateGray}
                onBlur={() => hideTooltip()}
                onFocus={() => showTooltip(TooltipTypeVisible.REGULATORY_THEMES)}
                onMouseLeave={() => hideTooltip()}
                onMouseOver={() => showTooltip(TooltipTypeVisible.REGULATORY_THEMES)}
                tabIndex={0}
              />
              {visibleTooltipType === TooltipTypeVisible.REGULATORY_THEMES && (
                <StyledTooltip id="regulatoryThemesTooltip" role="tooltip">
                  Ce champ est utilisé comme critère de recherche dans les zones réglementaire et les zones de
                  vigilance.
                </StyledTooltip>
              )}
            </IconAndMessageWrapper>
          </CheckPickerContainer>
          <TagWrapper>
            {filteredRegulatoryThemes?.map(theme => (
              <SingleTag
                key={theme}
                accent={Accent.SECONDARY}
                onDelete={handleDeleteRegulatoryTheme(theme)}
                title={theme}
              >
                {theme}
              </SingleTag>
            ))}
          </TagWrapper>
        </>
      )}

      {!isLinkingRegulatoryToVigilanceArea && (
        <>
          {' '}
          <CheckPickerContainer>
            <StyledCheckPicker
              customSearch={AMPCustomSearch}
              isLabelHidden
              isTransparent
              label="Type d'AMP"
              name="ampTypes"
              onChange={handleSetFilteredAmpTypes}
              options={ampTypes}
              placeholder="Type d'AMP"
              renderValue={() =>
                filteredAmpTypes && <OptionValue>{`Type d'AMP (${filteredAmpTypes.length})`}</OptionValue>
              }
              value={filteredAmpTypes}
            />
            <IconAndMessageWrapper>
              <StyledIconAttention
                aria-describedby="ampThemesTooltip"
                color={THEME.color.slateGray}
                onBlur={() => hideTooltip()}
                onFocus={() => showTooltip(TooltipTypeVisible.AMP_THEMES)}
                onMouseLeave={() => hideTooltip()}
                onMouseOver={() => showTooltip(TooltipTypeVisible.AMP_THEMES)}
                tabIndex={0}
              />
              {visibleTooltipType === TooltipTypeVisible.AMP_THEMES && (
                <StyledTooltip id="ampThemesTooltip" role="tooltip">
                  Ce champ est utilisé comme critère de recherche uniquement pour les AMP.
                </StyledTooltip>
              )}
            </IconAndMessageWrapper>
          </CheckPickerContainer>
          <TagWrapper>
            {filteredAmpTypes?.map(type => (
              <SingleTag key={type} accent={Accent.SECONDARY} onDelete={handleDeleteAmpType(type)} title={type}>
                {type}
              </SingleTag>
            ))}
          </TagWrapper>
        </>
      )}

      {(filteredRegulatoryThemes?.length > 0 || filteredAmpTypes?.length > 0) && (
        <ResetFilters onClick={handleResetFilters}>Réinitialiser les filtres</ResetFilters>
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
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`
const ResetFilters = styled.div`
  color: ${p => p.theme.color.slateGray};
  cursor: pointer;
  display: flex;
  padding: 0px;
  text-decoration: underline;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledCheckPicker = styled(CheckPicker)`
  flex: 1;
`
const CheckPickerContainer = styled.div`
  align-items: end;
  display: flex;
  gap: 8px;
`
const IconAndMessageWrapper = styled.div`
  position: relative;
`

const StyledTooltip = styled.p`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  padding: 4px 8px;
  position: absolute;
  left: 29px;
  top: -13px;
  width: 310px;
`
const StyledIconAttention = styled(Icon.Info)`
  cursor: pointer;
`
