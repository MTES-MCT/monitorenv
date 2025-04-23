import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { CustomPeriodContainer } from '@components/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { FrontendError } from '@libs/FrontendError'
import {
  Checkbox,
  CheckPicker,
  CheckTreePicker,
  CustomSearch,
  DateRangePicker,
  Select,
  SingleTag,
  useNewWindow,
  type DateAsStringRange,
  type Option
} from '@mtes-mct/monitor-ui'
import { filterSubTags, getTagsAsOptions, parseOptionsToTags } from '@utils/getTagsAsOptions'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { FrontCompletionStatusLabel, missionTypeEnum } from 'domain/entities/missions'
import { MissionFiltersEnum, updateFilters, type MissionFiltersState } from 'domain/shared_slices/MissionFilters'
import { forwardRef, useMemo } from 'react'
import styled from 'styled-components'

import type { MissionOptionsListType } from '..'
import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

type MapMissionFiltersProps = {
  onUpdateAdministrationFilter: (value: any) => void
  onUpdateDateRangeFilter: (value: DateAsStringRange | undefined) => void
  onUpdatePeriodFilter: (value: DateRangeEnum | undefined) => void
  onUpdateSimpleFilter: (value: any, filter: MissionFiltersEnum) => void
  optionsList: MissionOptionsListType
}

export const MapMissionFilters = forwardRef<HTMLDivElement, MapMissionFiltersProps>(
  (
    { onUpdateAdministrationFilter, onUpdateDateRangeFilter, onUpdatePeriodFilter, onUpdateSimpleFilter, optionsList },
    ref
  ) => {
    const dispatch = useAppDispatch()
    const { newWindowContainerRef } = useNewWindow()
    const {
      selectedAdministrationNames,
      selectedCompletionStatus,
      selectedControlUnitIds,
      selectedMissionTypes,
      selectedPeriod,
      selectedStatuses,
      selectedTags,
      selectedThemes,
      startedAfter,
      startedBefore
    } = useAppSelector(state => state.missionFilters)

    const { administrations, completion, controlUnits, dates, status, tags, themes, types } = optionsList

    const controlUnitsData = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
    const { data } = useGetThemesQuery()
    const themesAPI: ThemeFromAPI[] = Object.values(data ?? [])

    const controlUnitCustomSearch = useMemo(
      () => new CustomSearch(controlUnits ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
      [controlUnits]
    )

    const themeCustomSearch = useMemo(() => new CustomSearch(themes ?? [], ['label']), [themes])

    const udpateStatusFilter = (isChecked, value) => {
      const updatedFilter = [...(selectedStatuses ?? [])]

      if (!isChecked && updatedFilter.includes(String(value))) {
        const newFilter = updatedFilter.filter(statusFilter => statusFilter !== String(value))
        dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: newFilter }))
      }
      if (isChecked && !updatedFilter.includes(value)) {
        const newFilter = [...updatedFilter, value]
        dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: newFilter }))
      }
    }

    const onDeleteTag = <K extends MissionFiltersEnum>(
      valueToDelete: number | string | TagFromAPI,
      filterKey: K,
      selectedValues: MissionFiltersState[K]
    ) => {
      if (!Array.isArray(selectedValues)) {
        throw new FrontendError('`selectedValues` should be an array.')
      }

      const nextSelectedValues = selectedValues.filter(selectedValue => selectedValue !== valueToDelete) as
        | string[]
        | number[]
      dispatch(
        updateFilters({ key: filterKey, value: nextSelectedValues.length === 0 ? undefined : nextSelectedValues })
      )
    }

    const onDeleteTagTag = (valueToDelete: TagFromAPI, tagFilter: TagFromAPI[]) => {
      const updatedFilter: TagFromAPI[] = tagFilter
        .map(tag => filterSubTags(tag, valueToDelete))
        .filter(theme => theme !== undefined)
        .filter(theme => theme.id !== valueToDelete.id)
      dispatch(
        updateFilters({
          key: MissionFiltersEnum.TAGS_FILTER,
          value: updatedFilter.length === 0 ? undefined : updatedFilter
        })
      )
    }

    return (
      <FilterWrapper ref={ref}>
        <StyledBloc>
          <StyledStatusFilter>
            {status?.map(missionStatus => (
              <Checkbox
                key={missionStatus.label}
                checked={selectedStatuses?.includes(String(missionStatus.value))}
                label={missionStatus.label}
                name={missionStatus.label}
                onChange={isChecked => udpateStatusFilter(isChecked, missionStatus.value)}
              />
            ))}
          </StyledStatusFilter>
          <StyledSelect
            cleanable={false}
            isLabelHidden
            isTransparent
            label="Période"
            name="Période"
            onChange={onUpdatePeriodFilter}
            options={(dates ?? []) as Option<DateRangeEnum>[]}
            placeholder="Date de mission depuis"
            value={selectedPeriod}
          />
          {selectedPeriod === DateRangeEnum.CUSTOM && (
            <StyledCustomPeriodContainer>
              <DateRangePicker
                key="dateRange"
                baseContainer={newWindowContainerRef.current}
                defaultValue={
                  startedAfter && startedBefore ? [new Date(startedAfter), new Date(startedBefore)] : undefined
                }
                hasSingleCalendar
                isLabelHidden
                isStringDate
                label="Période spécifique"
                name="missionDateRange"
                onChange={onUpdateDateRangeFilter}
              />
            </StyledCustomPeriodContainer>
          )}
        </StyledBloc>
        <StyledBloc>
          <CheckPicker
            isLabelHidden
            isTransparent
            label="Administration"
            name="administration"
            onChange={onUpdateAdministrationFilter}
            options={administrations ?? []}
            placeholder="Administration"
            popupWidth={300}
            renderValue={() =>
              selectedAdministrationNames && (
                <OptionValue>{`Administration (${selectedAdministrationNames.length})`}</OptionValue>
              )
            }
            searchable
            value={selectedAdministrationNames}
          />

          {selectedAdministrationNames &&
            selectedAdministrationNames?.length > 0 &&
            selectedAdministrationNames.map(admin => (
              <SingleTag
                key={admin}
                onDelete={() =>
                  onDeleteTag(admin, MissionFiltersEnum.ADMINISTRATION_FILTER, selectedAdministrationNames)
                }
              >
                {`Admin. ${admin}`}
              </SingleTag>
            ))}

          <CheckPicker
            key={controlUnits?.length}
            customSearch={controlUnitCustomSearch}
            isLabelHidden
            isTransparent
            label="Unité"
            name="controlUnit"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.UNIT_FILTER)}
            options={controlUnits ?? []}
            placeholder="Unité"
            popupWidth={300}
            renderValue={() =>
              selectedControlUnitIds && <OptionValue>{`Unité (${selectedControlUnitIds.length})`}</OptionValue>
            }
            value={selectedControlUnitIds}
          />
          {selectedControlUnitIds &&
            selectedControlUnitIds?.length > 0 &&
            selectedControlUnitIds.map(unit => (
              <SingleTag
                key={unit}
                onDelete={() => onDeleteTag(unit, MissionFiltersEnum.UNIT_FILTER, selectedControlUnitIds)}
              >
                {`Unité ${controlUnitsData.currentData?.find(controlUnit => controlUnit.id === unit)?.name ?? unit}`}
              </SingleTag>
            ))}

          <CheckPicker
            isLabelHidden
            isTransparent
            label="Type de mission"
            name="missionType"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.TYPE_FILTER)}
            options={types ?? []}
            placeholder="Type de mission"
            renderValue={() =>
              selectedMissionTypes && <OptionValue>{`Type (${selectedMissionTypes.length})`}</OptionValue>
            }
            value={selectedMissionTypes}
          />
          {selectedMissionTypes &&
            selectedMissionTypes?.length > 0 &&
            selectedMissionTypes.map(type => (
              <SingleTag
                key={type}
                onDelete={() => onDeleteTag(type, MissionFiltersEnum.TYPE_FILTER, selectedMissionTypes)}
              >
                {`Type ${missionTypeEnum[type].libelle}`}
              </SingleTag>
            ))}

          <CheckPicker
            isLabelHidden
            isTransparent
            label="État des données"
            name="completion"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.COMPLETION_STATUS_FILTER)}
            options={completion ?? []}
            placeholder="État des données"
            renderValue={() =>
              selectedCompletionStatus && (
                <OptionValue>{`État des données (${selectedCompletionStatus.length})`}</OptionValue>
              )
            }
            value={selectedCompletionStatus}
          />
          {selectedCompletionStatus &&
            selectedCompletionStatus?.length > 0 &&
            selectedCompletionStatus.map(completionStatus => (
              <SingleTag
                key={completionStatus}
                onDelete={() =>
                  onDeleteTag(completionStatus, MissionFiltersEnum.COMPLETION_STATUS_FILTER, selectedCompletionStatus)
                }
              >
                {`Données ${FrontCompletionStatusLabel[completionStatus].toLowerCase()}`}
              </SingleTag>
            ))}
        </StyledBloc>
        <StyledBloc>
          <CheckPicker
            key={`theme${themes?.length}${JSON.stringify(selectedThemes)}`}
            customSearch={themeCustomSearch}
            isLabelHidden
            isTransparent
            label="Thématique"
            name="theme"
            onChange={(value: any) => onUpdateSimpleFilter(value, MissionFiltersEnum.THEME_FILTER)}
            options={themes ?? []}
            placeholder="Thématique"
            popupWidth={300}
            renderValue={() => selectedThemes && <OptionValue>{`Thème (${selectedThemes.length})`}</OptionValue>}
            value={selectedThemes}
          />
          {selectedThemes &&
            selectedThemes?.length > 0 &&
            selectedThemes.map(theme => (
              <SingleTag
                key={theme}
                onDelete={() => onDeleteTag(theme, MissionFiltersEnum.THEME_FILTER, selectedThemes)}
              >
                {`Thème ${themesAPI.find(themeAPI => themeAPI.id === theme)?.name ?? theme}`}
              </SingleTag>
            ))}
          <CheckTreePicker
            childrenKey="subTags"
            isLabelHidden
            isTransparent
            label="Tags et sous-tags"
            name="tags"
            onChange={value =>
              onUpdateSimpleFilter(value ? parseOptionsToTags(value) : undefined, MissionFiltersEnum.TAGS_FILTER)
            }
            options={tags}
            placeholder="Tags et sous-tags"
            renderedChildrenValue="Sous-tags."
            renderedValue="Tags"
            value={selectedTags ? getTagsAsOptions(selectedTags) : undefined}
            // customSearch={regulatoryTagsCustomSearch}
          />
          {selectedTags &&
            selectedTags?.length > 0 &&
            selectedTags.map(tag => (
              <>
                <SingleTag key={tag.id} onDelete={() => onDeleteTagTag(tag, selectedTags)}>
                  {`Tag ${tag.name}`}
                </SingleTag>
                {tag.subTags.map(subTag => (
                  <SingleTag key={subTag.id} onDelete={() => onDeleteTagTag(subTag, selectedTags)} title={subTag.name}>
                    {`Sous-tag ${subTag.name}`}
                  </SingleTag>
                ))}
              </>
            ))}
        </StyledBloc>
      </FilterWrapper>
    )
  }
)

const FilterWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  padding: 12px 4px;
`
const StyledBloc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StyledSelect = styled(Select<DateRangeEnum>)`
  .rs-picker-toggle-caret,
  .rs-picker-toggle-clean {
    top: 5px !important;
  }
`

export const StyledTagsContainer = styled.div<{ $withTopMargin: boolean }>`
  margin-top: ${p => (p.$withTopMargin ? '16px' : '0px')};
  display: flex;
  flex-direction: row;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
`

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  margin-top: 5px;
`

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const StyledStatusFilter = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
`
