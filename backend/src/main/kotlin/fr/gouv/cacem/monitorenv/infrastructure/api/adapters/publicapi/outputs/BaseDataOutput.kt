package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class BaseDataOutput(
    val id: Int,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<NextControlUnitResourceEntity>,
    val name: String,
) {
    companion object {
        fun fromBaseEntity(
            baseEntity: BaseEntity,
            controlUnitResourceService: ControlUnitResourceService
        ): BaseDataOutput {
            val controlUnitResources =
                controlUnitResourceService.getByIds(baseEntity.controlUnitResourceIds)

            return BaseDataOutput(
                id = requireNonNull(baseEntity.id),
                controlUnitResourceIds = baseEntity.controlUnitResourceIds,
                controlUnitResources,
                name = baseEntity.name,
            )
        }
    }
}
