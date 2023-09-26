package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class BaseDataOutput(
    val id: Int,
    val name: String,
) {
    companion object {
        fun fromBase(base: BaseEntity): BaseDataOutput {
            return BaseDataOutput(
                id = requireNotNull(base.id),
                name = base.name,
            )
        }
    }
}
