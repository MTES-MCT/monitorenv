package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class CreateOrUpdateBaseDataInput(
    val id: Int? = null,
    val latitude: Double,
    val longitude: Double,
    val name: String
) {
    fun toBase(): BaseEntity {
        return BaseEntity(
            id = this.id,
            latitude = this.latitude,
            longitude = this.longitude,
            name = this.name
        )
    }
}
