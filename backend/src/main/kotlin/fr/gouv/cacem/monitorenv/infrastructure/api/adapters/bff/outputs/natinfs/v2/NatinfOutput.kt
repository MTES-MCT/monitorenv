package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.natinfs.v2

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput

data class NatinfOutput(
    val id: Int,
    val nature: String?,
    val qualification: String?,
    val definedBy: String?,
    val repressedBy: String?,
    val themes: List<ThemeOutput>,
) {
    companion object {
        fun fromNatinf(natinf: NatinfEntity): NatinfOutput =
            NatinfOutput(
                id = natinf.refNatinf.id,
                nature = natinf.refNatinf.nature,
                qualification = natinf.refNatinf.qualification,
                definedBy = natinf.refNatinf.definedBy,
                repressedBy = natinf.refNatinf.repressedBy,
                themes = natinf.themes.map { ThemeOutput.fromThemeEntity(it) },
            )
    }
}
