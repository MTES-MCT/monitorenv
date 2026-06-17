package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.LegacyControlUnitResourceDataOutput.Companion.fromLegagcyControlResource

data class LegacyControlUnitDataOutput(
    val id: Int?,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlUnitResourceDataOutput>,
    val contact: String? = null,
) {
    companion object {
        fun fromLegacyControlUnit(controlUnit: LegacyControlUnitEntity): LegacyControlUnitDataOutput =
            LegacyControlUnitDataOutput(
                id = requireNotNull(controlUnit.id),
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                contact = controlUnit.contact,
                administration = controlUnit.administration,
                resources = controlUnit.resources.map { fromLegagcyControlResource(it) },
            )

        fun fromControlUnit(
            controlUnit: ControlUnitEntity,
            resources: List<ControlUnitResourceEntity>,
        ): LegacyControlUnitDataOutput =
            LegacyControlUnitDataOutput(
                id = controlUnit.id,
                administration = controlUnit.administration?.name ?: "",
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
