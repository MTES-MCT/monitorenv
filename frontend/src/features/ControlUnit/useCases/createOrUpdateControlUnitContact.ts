import { controlUnitContactsAPI } from '@api/controlUnitContactsAPI'

import type { ControlUnitContactFormValues } from '../components/ControlUnitDialog/ControlUnitContactList/types'
import type { ControlUnit } from '@mtes-mct/monitor-ui'
import type { HomeAppThunk } from '@store/index'

export const createOrUpdateControlUnitContact =
  (controlUnitContactFormValues: ControlUnitContactFormValues): HomeAppThunk<Promise<void>> =>
  async dispatch => {
    if (controlUnitContactFormValues.id === undefined) {
      const newControlUnitContact = controlUnitContactFormValues as ControlUnit.NewControlUnitContactData

      await dispatch(controlUnitContactsAPI.endpoints.createControlUnitContact.initiate(newControlUnitContact)).unwrap()

      return
    }

    const nextControlUnitContact = controlUnitContactFormValues as ControlUnit.ControlUnitContactData

    await dispatch(controlUnitContactsAPI.endpoints.patchControlUnitContact.initiate(nextControlUnitContact)).unwrap()
  }
