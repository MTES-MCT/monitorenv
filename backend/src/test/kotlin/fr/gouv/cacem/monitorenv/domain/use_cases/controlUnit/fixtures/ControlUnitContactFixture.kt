package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

class ControlUnitContactFixture {
    companion object {
        fun aControlUnitContact(): ControlUnitContactEntity =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 1,
                email = "test@mail.com",
                name = "Test Contact Name",
                phone = "0123456789",
                isSmsSubscriptionContact = true,
                isEmailSubscriptionContact = false,
            )
    }
}
