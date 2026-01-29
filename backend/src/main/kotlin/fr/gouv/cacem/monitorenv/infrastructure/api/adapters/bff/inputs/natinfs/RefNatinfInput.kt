package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.natinfs

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import kotlinx.serialization.Serializable

@Serializable
data class RefNatinfInput(
    val id: Int,
    val nature: String?,
    val qualification: String?,
    val definedBy: String?,
    val repressedBy: String?,
) {
    fun toRefNatinf(): RefNatinfEntity =
        RefNatinfEntity(
            id = id,
            nature = nature,
            qualification = qualification,
            definedBy = definedBy,
            repressedBy = repressedBy,
        )
}
