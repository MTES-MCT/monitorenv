package fr.gouv.cacem.monitorenv.domain.use_cases.administration.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

class AdministrationFixture {
    companion object {
        fun anAdministration() =
            AdministrationEntity(
                id = 0,
                name = "Admin 1",
                isArchived = false,
            )
    }
}
