import { useGetLayerNamesQuery, useGetRegulatoryAreasToCreateQuery } from '@api/regulatoryAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { Tooltip } from '@components/Tooltip'
import { RegulatoryArea } from '@features/RegulatoryArea/types'
import {
  Accent,
  Button,
  FormikDatePicker,
  FormikSelect,
  FormikTextarea,
  FormikTextInput,
  getLocalizedDayjs,
  getOptionsFromLabelledEnum,
  Icon,
  IconButton,
  Label,
  Select,
  THEME
} from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'
import type { GeoJSON } from 'domain/types/GeoJSON'

export function FormContent({ isEditing }: { isEditing: boolean }) {
  const { setFieldValue, values } = useFormikContext<RegulatoryArea.RegulatoryAreaFromAPI>()
  const [isEditingRefRegId, setIsEditingRefRegId] = useState<number | undefined>(undefined)
  const { data: layerNames } = useGetLayerNamesQuery()
  const { data: regulatoryAreasToCreate } = useGetRegulatoryAreasToCreateQuery()

  const layerNamesOptions = layerNames
    ? layerNames.layerNames
        .filter(layerName => layerName && layerName.trim() !== '')
        .map(layerName => ({
          label: getTitle(layerName),
          value: layerName
        }))
    : []

  const geomOptions = regulatoryAreasToCreate
    ? regulatoryAreasToCreate.map(regulatoryArea => ({
        label: String(regulatoryArea.id),
        value: {
          geom: regulatoryArea.geom,
          id: regulatoryArea.id,
          refReg: regulatoryArea.refReg
        }
      }))
    : []
  const seaFrontsAsOptions = Object.values(SeaFrontLabels)
  const regulatoryTypeOptions = getOptionsFromLabelledEnum(RegulatoryArea.RegulatoryAreaTypeLabel).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  const cancelEditRefReg = () => {
    setIsEditingRefRegId(undefined)
  }

  const validateRefReg = () => {
    setIsEditingRefRegId(undefined)
  }

  const getPeriodText = () => {
    const startDate = values?.date ? getLocalizedDayjs(values.date).format('DD/MM/YYYY') : undefined
    const endDate = values?.dateFin ? getLocalizedDayjs(values.dateFin).format('DD/MM/YYYY') : undefined

    if (!startDate && !endDate) {
      return undefined
    }

    if (startDate && !endDate) {
      return (
        <>
          En vigueur depuis <span>{startDate}</span>
        </>
      )
    }

    if (!startDate && endDate) {
      return (
        <>
          En vigueur jusqu&apos;au <span>{endDate}</span>
        </>
      )
    }

    return (
      <>
        En vigueur depuis <span>{startDate}</span> jusqu&apos;au <span>{endDate}</span>
      </>
    )
  }
  const renderMenuItem = (label, item) => (
    <GeomContainer title={label}>
      <p>{label}</p>
      <GeomRefReg>{item.optionValue.refReg}</GeomRefReg>
    </GeomContainer>
  )

  const setGeometryAndRefReg = (nextGeom: { geom: GeoJSON.MultiPolygon; id: number; refReg: string } | undefined) => {
    setFieldValue('geom', nextGeom?.geom)
    setFieldValue('id', nextGeom?.id)
    setFieldValue('refReg', nextGeom?.refReg)
  }

  const setThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    setFieldValue('themes', nextThemes)
  }

  const setTags = (nextTags: TagOption[] | undefined = []) => {
    setFieldValue('tags', nextTags)
  }

  return (
    <>
      <SubTitle>IDENTIFICATION DE LA ZONE RÉGLEMENTAIRE</SubTitle>
      <IdentificationContainer>
        <FieldWithTooltip>
          <FormikTextInput
            isErrorMessageHidden
            isRequired
            label="Titre de la zone réglementaire"
            name="polyName"
            style={{ flex: 1 }}
          />
          <Tooltip>
            Le titre de la zone doit être le plus explicite possible que le rendre intelligible à tous, même à des
            utilisateurs non experts sur différents sujets (ex : biodiversité), tels que les utilisateurs de MonitorExt.
          </Tooltip>
        </FieldWithTooltip>
        <FieldWithTooltip>
          <FormikSelect
            isErrorMessageHidden
            isRequired
            label="Titre du groupe de réglementation"
            name="layerName"
            options={layerNamesOptions}
            renderExtraFooter={() => (
              <ExtraFooterContainer>
                <Icon.Plus />
                Ajouter un nouveau groupe
              </ExtraFooterContainer>
            )}
            style={{ flex: 1 }}
          />
          <Tooltip>Le nom du groupe doit permettre de connaître le lieu et le sujet de la réglementation.</Tooltip>
        </FieldWithTooltip>
        <InlineFieldsContainer>
          <Select
            disabled={isEditing}
            isRequired
            label="Géométrie"
            name="geom"
            onChange={setGeometryAndRefReg}
            options={geomOptions}
            optionValueKey="id"
            renderMenuItem={renderMenuItem}
            style={{ width: '30%' }}
            value={
              isEditing && values.geom && values.id && values.refReg
                ? {
                    geom: values.geom,
                    id: values.id,
                    refReg: values.refReg
                  }
                : geomOptions.find(option => option.value.id === values.id)?.value
            }
          />
          <FormikSelect isRequired label="Façade" name="facade" options={seaFrontsAsOptions} style={{ width: '30%' }} />
          <FormikSelect
            isErrorMessageHidden
            isRequired
            label="Ensemble réglementaire"
            name="type"
            options={regulatoryTypeOptions}
            style={{ width: '40%' }}
          />
        </InlineFieldsContainer>
        <div>
          <InlineFieldsContainer>
            <RegulatoryThemesFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Thématiques et sous-thématiques"
              onChange={setThemes}
              style={{ width: '50%' }}
              value={values?.themes ?? []}
            />
            <RegulatoryTagsFilter
              isLabelHidden={false}
              isRequired
              isTransparent={false}
              label="Tags et sous-tags"
              onChange={setTags}
              style={{ width: '50%' }}
              value={values?.tags ?? []}
            />
          </InlineFieldsContainer>
          <InformationMessage>
            Sélectionner au moins une thématique/sous-thématique ou un tag/sous-tag
          </InformationMessage>
        </div>
        <div>
          <FormikTextarea label="Résumé" name="resume" rows={4} />
          <InformationMessage>
            Le résumé concerne tout ce qui n’est pas une période. Les périodes sont à renseigner plus bas.
          </InformationMessage>
        </div>
      </IdentificationContainer>
      <SubTitle>TEXTE(S) RÉGLEMENTAIRE(S) EN VIGUEUR</SubTitle>

      {!isEditingRefRegId ? (
        <RefRegContainer>
          <RefRegTextContainer>
            <RefRegText title={values?.refReg}>{values?.refReg} </RefRegText>
            <Link href={values?.url}>{values?.url}</Link>
            <PeriodText>{getPeriodText()}</PeriodText>
          </RefRegTextContainer>
          <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={() => setIsEditingRefRegId(values?.id)} />
        </RefRegContainer>
      ) : (
        <EditingRefRegContainer>
          <div>
            <Label>Titre de la réglementation</Label>
            <RefRegText>{values.refReg} </RefRegText>
          </div>

          <RefRegSecondLine>
            <FormikTextInput isLight label="URL du lien" name="url" style={{ width: '65%' }} />
            <DateContainer>
              <FormikDatePicker isLight isRequired label="Début de validité" name="date" />
              <FormikDatePicker isLight isRequired label="Fin de validité" name="dateFin" />
            </DateContainer>
          </RefRegSecondLine>
          <ButtonsWrapper>
            <Button accent={Accent.SECONDARY} onClick={cancelEditRefReg}>
              Annuler
            </Button>
            <ValidateButton onClick={validateRefReg}>Valider</ValidateButton>
          </ButtonsWrapper>
        </EditingRefRegContainer>
      )}

      <SubTitle>PÉRIODE(S)</SubTitle>
      <PeriodContainer>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.mediumSeaGreen} size={10} />
            Période d&apos;autorisation
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période autorisée"
            name="authorizePeriod"
            placeholder="Détail de la période d’autorisation"
          />
        </Period>
        <Period>
          <Label>
            <StyledIcon color={THEME.color.maximumRed} size={10} />
            Période d&apos;interdiction
          </Label>
          <FormikTextarea
            isLabelHidden
            label="Période d'interdiction"
            name="forbidPeriod"
            placeholder="Détail de la période d’interdiction"
          />
        </Period>
      </PeriodContainer>
    </>
  )
}

const SubTitle = styled.h2`
  border-bottom: 1px solid ${THEME.color.lightGray};
  font-size: 16px;
  color: ${THEME.color.slateGray};
  margin-bottom: 16px;
  margin-top: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
`

const InlineFieldsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`
const FieldWithTooltip = styled.div`
  align-items: end;
  display: flex;
  flex: 1;
  gap: 8px;
`
const GeomContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const GeomRefReg = styled.p`
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ExtraFooterContainer = styled.div`
  align-items: center;
  border-top: 1px solid ${p => p.theme.color.lightGray};
  display: flex;
  gap: 8px;
  padding: 8px;
`

const InformationMessage = styled.span`
  font-style: italic;
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`

const RefRegContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  gap: 16px;
  padding: 8px;
`
const RefRegTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EditingRefRegContainer = styled(RefRegContainer)`
  flex-direction: column;
`

const RefRegSecondLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const RefRegText = styled.p`
  font-size: 13px;
  white-space: wrap;
`

const ValidateButton = styled(Button)`
  background: ${p => p.theme.color.mediumSeaGreen};
  border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  color: ${p => p.theme.color.white};
  &:not(:disabled):hover {
    background: ${p => p.theme.color.mediumSeaGreen};
    border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const DateContainer = styled.div`
  display: flex;
  gap: 8px;
`
const PeriodContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 94px;
`

const Period = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledIcon = styled(Icon.CircleFilled)`
  margin-right: 8px;
`

const IdentificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Link = styled.a`
  color: ${p => p.theme.color.blueGray};
  font-size: 13px;
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PeriodText = styled.p`
  font-size: 13px;
  color: ${p => p.theme.color.slateGray};
  margin-top: 6px;
  > span {
    color: ${p => p.theme.color.gunMetal};
  }
`
