import { addMainWindowBanner } from '@features/MainWindow/dispatchers/addMainWindowBanner'
import { mainWindowActions } from '@features/MainWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, ControlUnit, FormikTextInput, Icon, Level, Message } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

import { FieldWithButton } from './FieldWithButton'

import type { ControlUnitContactFormValues } from '../types'

type FormikIsEmailSubscriptionContactToggleProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function FormikEmailField({ controlUnit }: FormikIsEmailSubscriptionContactToggleProps) {
  const { setFieldValue, values } = useFormikContext<ControlUnitContactFormValues>()

  const dispatch = useAppDispatch()

  const [isConfirmationMessageOpened, setIsConfirmationMessageOpened] = useState(false)
  const [noEmailSubscriptionContactWarningBannerRank, setNoEmailSubscriptionContactWarningBannerRank] = useState<
    number | undefined
  >(undefined)
  const [otherContactSubscribedEmail, setOtherContactSubscribedEmail] = useState<string | undefined>(undefined)

  const askForConfirmation = () => {
    // If the user is trying to subscribe this contact while another contact is already subscribed, ask for confirmation
    if (!values.isEmailSubscriptionContact) {
      const maybeOtherEmailSubscriptionContact = controlUnit.controlUnitContacts.find(
        controlUnitContact => controlUnitContact.id !== values.id && controlUnitContact.isEmailSubscriptionContact
      )
      if (maybeOtherEmailSubscriptionContact && maybeOtherEmailSubscriptionContact.email) {
        setOtherContactSubscribedEmail(maybeOtherEmailSubscriptionContact.email)
        setIsConfirmationMessageOpened(true)

        return
      }
    }

    toggle()
  }

  const closeConfirmationMessage = () => {
    setIsConfirmationMessageOpened(false)
    setOtherContactSubscribedEmail(undefined)
  }

  const toggle = () => {
    setIsConfirmationMessageOpened(false)

    const willBeSubscribed = !values.isEmailSubscriptionContact
    // Since there can be only one email subscription contact per control unit,
    // if this one is being subscribed, we need to warn the user that this control unit will no longer receive any email
    if (!willBeSubscribed) {
      const nextNoEmailSubscriptionContactWarningBannerRank = dispatch(
        addMainWindowBanner({
          children:
            'Cette unité n’a actuellement plus d’adresse de diffusion. Elle ne recevra plus de préavis ni de bilan de ses activités de contrôle.',
          closingDelay: 115000,
          isClosable: true,
          isFixed: true,
          level: Level.WARNING,
          withAutomaticClosing: true
        })
      )

      setNoEmailSubscriptionContactWarningBannerRank(nextNoEmailSubscriptionContactWarningBannerRank)
    } else if (noEmailSubscriptionContactWarningBannerRank !== undefined) {
      dispatch(mainWindowActions.removeBanner(noEmailSubscriptionContactWarningBannerRank))
    }

    setFieldValue('isEmailSubscriptionContact', willBeSubscribed)
  }

  return (
    <>
      <FieldWithButton>
        <FormikTextInput
          isLight
          label="Adresse mail"
          name="email"
          readOnly={values.isEmailSubscriptionContact}
          type="email"
        />
        {values.isEmailSubscriptionContact ? (
          <FieldWithButton.IconButtonOn
            Icon={Icon.Subscription}
            onClick={toggle}
            title="Retirer cette adresse de la liste de diffusion des préavis et des bilans d’activités de contrôle"
          />
        ) : (
          <FieldWithButton.IconButtonOff
            Icon={Icon.Subscription}
            onClick={askForConfirmation}
            title="Ajouter cette adresse à la liste de diffusion des préavis et des bilans d’activités de contrôle"
          />
        )}
      </FieldWithButton>

      {values.isEmailSubscriptionContact && (
        <Message Icon={Icon.Subscription} level={Level.INFO}>
          <p>
            <strong>Adresse de diffusion</strong>
            <br />
            Cette adresse est utilisée pour envoyer à l’unité les préavis de débarquement ainsi que le bilan
            hebdomadaire de ses activités de contrôle.
          </p>
        </Message>
      )}

      {isConfirmationMessageOpened && otherContactSubscribedEmail && (
        <Message level={Level.WARNING}>
          <p>
            <strong>Attention</strong>
            <br />
            Attention l’adresse actuelle de diffusion à cette unité est : <b>{otherContactSubscribedEmail}</b>.{' '}
            Voulez-vous la remplacer par : <b>{values.email}</b> ?
          </p>

          <ActionBar>
            <Button accent={Accent.WARNING} onClick={toggle}>
              Oui, la remplacer
            </Button>
            <Button accent={Accent.WARNING} onClick={closeConfirmationMessage}>
              Non, conserver l’adresse actuelle
            </Button>
          </ActionBar>
        </Message>
      )}
    </>
  )
}

const ActionBar = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  > .Element-Button:not(:first-child) {
    margin-top: 8px;
  }
`
