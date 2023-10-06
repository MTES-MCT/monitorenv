package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class CreateOrUpdateBaseDataInput(
    val id: Int? = null,
    val latitude: String,
    val longitude: String,
    val name: String,
) {
    fun toBase(): BaseEntity {
        return BaseEntity(
            id = this.id,
            latitude = this.latitude.toDouble(),
            longitude = this.longitude.toDouble(),
            name = this.name,
        )
    }
}
