import React from 'react'
import styled from 'styled-components'
import { Field } from 'formik'

import { PrimaryButton } from '../../commonStyles/Buttons.style'
import { infractionFactory } from '../Missions.helpers'

export const InfractionsForm = ({  push, form, actionIndex }) =>  {
  
  const handleAddInfraction = () => push(infractionFactory())

  return (<>
    <h3>Détailler une infraction d&apos;une cible</h3>
    <PrimaryButton
      type="button"
      onClick={handleAddInfraction}
    >
      + Ajouter
    </PrimaryButton>
    {form?.values.actions.length > 0 && form?.values.actions[actionIndex]?.infractions.length > 0 ? 
      form?.values.actions[actionIndex]?.infractions.map((infraction, index) => {
        return (
        <div key={index} >
          <Field name={`actions[${actionIndex}].infractions[${index}].natinf`} />
          <Field name={`actions[${actionIndex}].infractions[${index}].observations`} />
        </div>
      )})
    : <NoAction>Aucune infraction engregistrée pour le moment</NoAction>
  }
    
  </>
)}

const NoAction = styled.div`
  text-align: center;
`