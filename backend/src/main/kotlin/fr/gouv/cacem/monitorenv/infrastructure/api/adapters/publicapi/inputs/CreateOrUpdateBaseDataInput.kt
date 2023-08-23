package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class CreateOrUpdateBaseDataInput(
    val id: Int? = null,
    val controlUnitResourceIds: List<Int>,
    val name: String,
) {
    fun toBaseEntity(): BaseEntity {
        return BaseEntity(
            id = this.id,
            controlUnitResourceIds = this.controlUnitResourceIds,
            name = this.name,
        )
    }
}
