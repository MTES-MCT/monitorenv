package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

class RegulatoryAreaFixture {

    companion object {
        fun aRegulatoryArea(id: Int = 1): RegulatoryAreaEntity {
            return RegulatoryAreaEntity(id = id)
        }
    }
}
