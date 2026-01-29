package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity

data class RefNatinfOutput(
    val id: Int,
    val nature: String?,
    val qualification: String?,
    val definedBy: String?,
    val repressedBy: String?,
) {
    companion object {
        fun fromRefNatinf(refNatinf: RefNatinfEntity): RefNatinfOutput =
            RefNatinfOutput(
                id = refNatinf.id,
                nature = refNatinf.nature,
                qualification = refNatinf.qualification,
                definedBy = refNatinf.definedBy,
                repressedBy = refNatinf.repressedBy,
            )
    }
}
