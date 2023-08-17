package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity

data class CreateOrUpdatePortDataInput(
    val id: Int? = null,
    val controlUnitResourceIds: List<Int>,
    val name: String,
) {
    fun toPortEntity(): PortEntity {
        return PortEntity(
            id = this.id,
            controlUnitResourceIds = this.controlUnitResourceIds,
            name = this.name,
        )
    }
}
