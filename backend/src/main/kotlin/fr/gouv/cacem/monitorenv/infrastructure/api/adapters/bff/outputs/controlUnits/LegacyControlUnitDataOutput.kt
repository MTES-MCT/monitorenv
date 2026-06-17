package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

data class LegacyControlUnitDataOutput(
    val id: Int?,
    val administration: String,
    val contact: String?,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlUnitResourceDataOutput>,
) {
    companion object {
        fun fromLegacyControlUnit(legacyControlUnit: LegacyControlUnitEntity) =
            LegacyControlUnitDataOutput(
                id = legacyControlUnit.id,
                administration = legacyControlUnit.administration,
                contact = legacyControlUnit.contact,
                name = legacyControlUnit.name,
                isArchived = legacyControlUnit.isArchived,
                resources =
                    legacyControlUnit.resources.map {
                        LegacyControlUnitResourceDataOutput.fromLegacyControlResourceEntity(it)
                    },
            )

        fun fromControlUnit(
            controlUnit: ControlUnitEntity,
            resources: List<ControlUnitResourceEntity>,
        ) = LegacyControlUnitDataOutput(
            id = controlUnit.id,
            administration = controlUnit.administration?.name ?: "",
            contact = controlUnit.contact,
            name = controlUnit.name,
            isArchived = controlUnit.isArchived,
            resources =
                resources.map {
                    LegacyControlUnitResourceDataOutput.fromControlResourceEntity(
                        it,
                    )
                },
        )
    }
}
