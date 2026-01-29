package fr.gouv.cacem.monitorenv.domain.entities.natinf.v2

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity

data class NatinfEntity(
    val refNatinf: RefNatinfEntity,
    val themes: List<ThemeEntity>,
)
