package fr.gouv.cacem.monitorenv.domain.use_cases.species.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.species.SpecyEntity

class SpecyFixture {
    companion object {
        fun aSpecy() = SpecyEntity(id = 1, code = "A", name = "Test Specy 1")
    }
}
