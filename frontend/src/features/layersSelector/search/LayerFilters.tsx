import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  getIsLinkingZonesToVigilanceArea
} from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  type DateAsStringRange,
  type Option,
  Accent,
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  Icon,
  Select,
  SingleTag,
  THEME
} from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

type LayerFiltersProps = {
  ampTypes: Option<string>[]
  filteredAmpTypes: string[]
  filteredRegulatoryThemes: string[]
  filteredVigilanceAreaPeriod: string | undefined
  handleResetFilters: () => void
  regulatoryThemes: Option<string>[]
  setFilteredAmpTypes: (filteredAmpTypes: string[]) => void
  setFilteredRegulatoryThemes: (filteredRegulatoryThemes: string[]) => void
  setFilteredVigilanceAreaPeriod: (
    filteredVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  ) => void
  updateDateRangeFilter: (dateRange: DateAsStringRange | undefined) => void
  vigilanceAreaPeriodOptions: Option<string>[]
}

enum TooltipTypeVisible {
  AMP_THEMES = 'AMP_THEMES',
  REGULATORY_THEMES = 'REGULATORY_THEMES',
  VIGILANCE_AREA_PERIOD = 'VIGILANCE_AREA_PERIOD'
}
export function LayerFilters({
  ampTypes,
  filteredAmpTypes,
  filteredRegulatoryThemes,
  filteredVigilanceAreaPeriod,
  handleResetFilters,
  regulatoryThemes,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setFilteredVigilanceAreaPeriod,
  updateDateRangeFilter,
  vigilanceAreaPeriodOptions
}: LayerFiltersProps) {
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const [visibleTooltipType, setVisibleTooltipType] = useState<TooltipTypeVisible | undefined>(undefined)

  const showTooltip = type => setVisibleTooltipType(type)
  const hideTooltip = () => setVisibleTooltipType(undefined)

  const handleSetFilteredAmpTypes = nextAmpThemes => {
    setFilteredAmpTypes(nextAmpThemes)
  }
  const handleDeleteAmpType = ampThemeToDelete => () => {
    setFilteredAmpTypes(filteredAmpTypes.filter(theme => theme !== ampThemeToDelete))
  }

  const handleSetFilteredRegulatoryThemes = nextRegulatoryThemes => {
    setFilteredRegulatoryThemes(nextRegulatoryThemes)
  }
  const handleDeleteRegulatoryTheme = regulatoryThemeToDelete => () => {
    setFilteredRegulatoryThemes(filteredRegulatoryThemes.filter(theme => theme !== regulatoryThemeToDelete))
  }

  const handleSetFilteredVigilancePeriod = nextVigilanceAreaPeriod => {
    setFilteredVigilanceAreaPeriod(nextVigilanceAreaPeriod)
  }

  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemes as Array<Option>, ['label']),
    [regulatoryThemes]
  )

  const AMPCustomSearch = useMemo(() => new CustomSearch(ampTypes as Array<Option>, ['label']), [ampTypes])

  return (
    <FiltersWrapper>
      {!isLinkingAmpToVigilanceArea && (
        <SelectContainer>
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
                Ce champ est utilisé comme critère de recherche dans les zones réglementaire et les zones de vigilance.
              </StyledTooltip>
            )}
          </IconAndMessageWrapper>
        </SelectContainer>
      )}

      {!isLinkingRegulatoryToVigilanceArea && (
        <SelectContainer>
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
        </SelectContainer>
      )}

      {!isLinkingZonesToVigilanceArea && (
        <SelectContainer>
          <StyledSelect
            isLabelHidden
            isTransparent
            label="Période de vigilance"
            name="periodOfVigilanceArea"
            onChange={handleSetFilteredVigilancePeriod}
            options={vigilanceAreaPeriodOptions}
            placeholder="Période de vigilance"
            value={filteredVigilanceAreaPeriod}
          />
          <IconAndMessageWrapper>
            <StyledIconAttention
              aria-describedby="vigilanceAreaPeriodTooltip"
              color={THEME.color.slateGray}
              onBlur={() => hideTooltip()}
              onFocus={() => showTooltip(TooltipTypeVisible.VIGILANCE_AREA_PERIOD)}
              onMouseLeave={() => hideTooltip()}
              onMouseOver={() => showTooltip(TooltipTypeVisible.VIGILANCE_AREA_PERIOD)}
              tabIndex={0}
            />
            {visibleTooltipType === TooltipTypeVisible.VIGILANCE_AREA_PERIOD && (
              <StyledTooltip id="vigilanceAreaPeriodTooltip" role="tooltip">
                Ce champ est utilisé uniquement comme critère de recherche pour les zones de vigilance.
              </StyledTooltip>
            )}
          </IconAndMessageWrapper>
        </SelectContainer>
      )}
      {filteredVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && (
        <DateRangePicker
          key="dateRange"
          data-cy="datepicker-missionStartedAfter"
          defaultValue={
            vigilanceAreaSpecificPeriodFilter ? (vigilanceAreaSpecificPeriodFilter as DateAsStringRange) : undefined
          }
          isLabelHidden
          isStringDate
          label="Période spécifique"
          name="dateRange"
          onChange={updateDateRangeFilter}
        />
      )}

      {(filteredRegulatoryThemes?.length > 0 || filteredAmpTypes?.length > 0) && (
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

          {filteredAmpTypes?.map(type => (
            <SingleTag key={type} accent={Accent.SECONDARY} onDelete={handleDeleteAmpType(type)} title={type}>
              {type}
            </SingleTag>
          ))}
        </TagWrapper>
      )}
      {(filteredRegulatoryThemes?.length > 0 || filteredAmpTypes?.length > 0 || !!filteredVigilanceAreaPeriod) && (
        <ResetFilters onClick={handleResetFilters}>Réinitialiser les filtres</ResetFilters>
      )}
    </FiltersWrapper>
  )
}

const FiltersWrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  border-top: 2px solid ${p => p.theme.color.lightGray};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  text-align: left;
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
const StyledSelect = styled(Select)`
  flex: 1;
`
const SelectContainer = styled.div`
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
