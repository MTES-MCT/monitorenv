package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class PortDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<NextControlUnitResourceEntity>,
    val name: String,
) {
    companion object {
        fun fromPortEntity(
            portEntity: PortEntity,
            controlUnitResourceService: ControlUnitResourceService
        ): PortDataOutput {
            val controlUnitResources =
                controlUnitResourceService.getByIds(portEntity.controlUnitResourceIds)

            return PortDataOutput(
                id = requireNonNull(portEntity.id),
                controlUnitResourceIds = portEntity.controlUnitResourceIds,
                controlUnitResources,
                name = portEntity.name,
            )
        }
    }
}
