package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.natinfs

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput

data class NatinfInput(
    val refNatinf: RefNatinfInput,
    val themes: List<ThemeInput>,
) {
    fun toNatinfEntity(): NatinfEntity =
        NatinfEntity(
            refNatinf = refNatinf.toRefNatinf(),
            themes = themes.map { it.toThemeEntity() },
        )
}
