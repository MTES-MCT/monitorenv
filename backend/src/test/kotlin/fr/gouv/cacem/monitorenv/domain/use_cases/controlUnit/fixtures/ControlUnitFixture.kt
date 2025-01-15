package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

class ControlUnitFixture {
    companion object {
        fun aLegacyControlUnit(): LegacyControlUnitEntity {
            return LegacyControlUnitEntity(
                id = 1,
                administration = "DIRM / DM",
                isArchived = false,
                name = "Cross Etel",
                resources = listOf(),
                contact = null,
            )
        }
    }
}
