package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v2.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.fixtures.RefNatinfFixture.Companion.aRefNatinf
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme

class NatinfFixture {
    companion object {
        fun aNatinf(id: Int = 1) =
            NatinfEntity(
                refNatinf = aRefNatinf(id = id),
                themes = listOf(aTheme(id = 1)),
            )
    }
}
