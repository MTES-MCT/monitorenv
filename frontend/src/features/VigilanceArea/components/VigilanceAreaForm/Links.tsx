import { Links as LinksComponent } from '@components/Form/Links/Links'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useField, useFormikContext } from 'formik'

import type { Link } from '@components/Form/types'

export function Links() {
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()
  const [field] = useField<Array<Link>>('links')

  return (
    <LinksComponent
      links={field.value}
      onDelete={links => setFieldValue('links', links)}
      onValidate={links => setFieldValue('links', links)}
    />
  )
}
