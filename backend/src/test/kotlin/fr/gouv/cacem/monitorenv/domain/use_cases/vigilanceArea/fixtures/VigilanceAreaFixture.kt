package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity

class VigilanceAreaFixture {

    companion object {
        fun aVigilanceArea(): VigilanceAreaEntity {
            return VigilanceAreaEntity(isArchived = false, isDeleted = false, isDraft = false)
        }
    }
}
