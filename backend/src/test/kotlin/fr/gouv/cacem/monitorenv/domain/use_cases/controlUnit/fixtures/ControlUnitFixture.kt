package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

class ControlUnitFixture {
    companion object {
        fun aLegacyControlUnit(name: String = "Cross Etel"): LegacyControlUnitEntity =
            LegacyControlUnitEntity(
                id = 1,
                administration = "DIRM / DM",
                isArchived = false,
                name = name,
                resources = listOf(),
                contact = null,
            )

        fun aControlUnit(name: String = "Cross Etel"): ControlUnitEntity =
            ControlUnitEntity(
                id = 1,
                administrationId = 1,
                administration = null,
                isArchived = false,
                name = name,
            )
    }
}
