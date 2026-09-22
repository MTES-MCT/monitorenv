import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Button, Dialog, FormikDatePicker, FormikTextInput, Icon, Message } from '@mtes-mct/monitor-ui'
import { Formik } from 'formik'
import styled from 'styled-components'

import { ThemeFormSchema } from './Schema'
import { SubThemeForm } from './SubThemeForm'
import { saveTheme } from '../../useCases/saveTheme'

import type { ThemeTable, ThemeToAPI } from 'domain/entities/themes'

const messageColor = '#45688A'
type ThemeFormProps = { onCancel: () => void; onSubmit: () => void; theme: ThemeTable | undefined }
export function ThemeForm({ onCancel, onSubmit, theme }: ThemeFormProps) {
  const dispatch = useAppDispatch()

  if (!theme) {
    return null
  }

  return (
    <Formik
      initialValues={theme}
      onSubmit={(values: ThemeTable) => {
        const themeToAPI: ThemeToAPI = {
          endedAt: values?.endedAt,
          id: values?.id,
          name: values?.name,
          startedAt: values?.startedAt,
          subThemes: values?.subThemes.map(subTheme => ({
            endedAt: subTheme?.endedAt,
            id: subTheme?.id,
            name: subTheme?.name,
            startedAt: subTheme?.startedAt
          }))
        }
        dispatch(saveTheme(themeToAPI))
        onSubmit()
      }}
      validateOnChange={false}
      validationSchema={ThemeFormSchema}
    >
      {({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <Dialog.Title>
            {values.id ? 'Modifier une thématique / sous-thématique' : 'Ajouter une thématique'}
          </Dialog.Title>
          <Dialog.Body style={{ paddingTop: 0, width: '968px' }}>
            {values.id && (
              <Message Icon={Icon.AttentionFilled} iconColor={messageColor} style={{ marginTop: '24px' }}>
                <MessageTitle>Procédure interne</MessageTitle>
                Les thématiques et sous-thématiques ne doivent être modifiées que dans le cas d’une faute de frappe ou
                d’un renommage léger d’une thématique / sous-thématique. Si une nouvelle thématique / sous-thématique
                diffère d’une ancienne, il faut en créer une nouvelle.
              </Message>
            )}
            <Fields>
              <FormikTextInput isErrorMessageHidden isRequired label="Nom" name="name" />
              <Inline>
                <FormikDatePicker
                  isErrorMessageHidden
                  isRequired
                  isStringDate
                  label="Début de validité"
                  name="startedAt"
                />
                <FormikDatePicker isEndDate isErrorMessageHidden isStringDate label="Fin de validité" name="endedAt" />
              </Inline>
            </Fields>
            <Separator />
            <SubThemeForm subThemes={values.subThemes} />
          </Dialog.Body>
          <Dialog.Action>
            <Button
              accent={Accent.SECONDARY}
              onClick={() => {
                onCancel()
              }}
            >
              Annuler
            </Button>
            <Button accent={Accent.PRIMARY} type="submit">
              {values.id ? 'Valider les modifications' : 'Créer'}
            </Button>
          </Dialog.Action>
        </form>
      )}
    </Formik>
  )
}

const MessageTitle = styled.h5`
  color: ${messageColor};
  font-size: 13px;
  line-height: 18px;
`

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
`

const Inline = styled.div`
  align-items: baseline;
  display: flex;
  gap: 8px;
`

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  margin: 32px 0;
`
