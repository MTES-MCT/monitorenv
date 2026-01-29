package fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.natinf.v1.RefNatinfEntity

class RefNatinfFixture {
    companion object {
        fun aRefNatinf(id: Int = 1) =
            RefNatinfEntity(
                id = id,
                nature = "nature",
                qualification = "qualification",
                definedBy = "definedBy",
                repressedBy = "repressedBy",
            )
    }
}
