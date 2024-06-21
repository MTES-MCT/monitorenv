import { ZonePicker } from '@features/commonComponents/ZonePicker'
import {
  FormikDatePicker,
  FormikDateRangePicker,
  FormikMultiRadio,
  FormikNumberInput,
  FormikSelect,
  FormikTextarea,
  FormikTextInput,
  Select
} from '@mtes-mct/monitor-ui'
import { InteractionListener } from 'domain/entities/map/constants'
import { Formik } from 'formik'
import styled from 'styled-components'

import { Links } from './Links'

export function VigilanceAreaForm({ isOpen }) {
  const submit = () => {}

  const deleteZone = () => {}

  const addZone = () => {}

  return (
    <Wrapper $isOpen={isOpen}>
      <Header>
        <Square />
        <Title>Création d&apos;une zone de vigilance</Title>
      </Header>

      <Formik initialValues={{}} onSubmit={submit}>
        <FormContainer>
          <FormikTextInput label="Nom de la zone de vigilance" name="name" placeholder="Nom de la zone" />
          <FormikDateRangePicker isCompact label="Période de validité" name="period" />
          <FormikSelect
            label="Récurrence"
            name="frequency"
            options={[
              { label: 'Aucune', value: 'NONE' },
              { label: 'Toutes les semaines', value: 'ALL_WEEKS' },
              { label: 'Toutes les mois', value: 'ALL_MONTHS' },
              { label: 'Toutes les ans', value: 'ALL_YEARS' },
              { label: 'Personnaliser', value: 'CUSTOM' }
            ]}
          />
          <Select
            label="Fin récurrence"
            name="endingCondition"
            options={[
              { label: 'Jamais', value: 'NEVER' },
              { label: 'Après .... X fois', value: 'END_DATE' },
              { label: 'Le ...', value: 'OCCURENCES_NUMBER' }
            ]}
          />
          <FormikNumberInput isLabelHidden label="Nombre de fois" name="endingOccurrencesNumber" />
          <FormikDatePicker isLabelHidden label="Date de fin de récurrence" name="endOccurenceDate" />
          <FormikSelect
            label="Thématique"
            name="themes"
            options={[
              { label: 'Zone de protection', value: 'zone_de_protection' },
              { label: 'Zone de surveillance', value: 'zone_de_surveillance' }
            ]}
            placeholder="Sélectionner un/des thématique(s)"
          />
          <FormikMultiRadio
            isInline
            label="Visibilité"
            name="visibility"
            options={[
              { label: 'Publique', value: 'PUBLIC' },
              { label: 'Interne CACEM', value: 'INTERN' }
            ]}
          />
          <FormikTextarea label="Commentaire" name="comments" placeholder="Description de la zone de vigilance" />
          <ZonePicker
            addLabel="Définir un tracé pour la zone de vigilance"
            deleteZone={deleteZone}
            handleAddZone={addZone}
            label="Localisation"
            listener={InteractionListener.VIGILANCE_ZONE}
            name="geom"
          />
          <Links />
        </FormContainer>
      </Formik>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $isOpen: boolean }>`
  border-radius: 2px;
  width: 400px;
  display: block;
  color: ${p => p.theme.color.charcoal};
  opacity: ${p => (p.$isOpen ? 1 : 0)};
  padding: 0;
  transition: all 0.5s;
  height: calc(100vh - 64px);
`

const Header = styled.header`
  align-items: center;
  background-color: ${p => p.theme.color.blueGray25};
  display: flex;
  padding: 11px 16px;
`
const Title = styled.span`
  font-size: 15px;
  color: ${p => p.theme.color.gunMetal};
`
const Square = styled.div`
  width: 18px;
  height: 18px;
  background: #d6df64; /* TODO: add color inmonitor-ui */
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
const FormContainer = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
`
