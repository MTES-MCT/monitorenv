package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class BaseDataOutput(
    val id: Int,
    val latitude: String,
    val longitude: String,
    val name: String,
) {
    companion object {
        fun fromBase(base: BaseEntity): BaseDataOutput {
            return BaseDataOutput(
                id = requireNotNull(base.id),
                latitude = base.latitude.toString(),
                longitude = base.longitude.toString(),
                name = base.name,
            )
        }
    }
}
