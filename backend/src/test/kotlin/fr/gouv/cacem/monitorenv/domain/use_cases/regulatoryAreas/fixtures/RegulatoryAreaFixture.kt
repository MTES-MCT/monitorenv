package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

class RegulatoryAreaFixture {
    companion object {
        fun aRegulatoryArea(id: Int = 1): RegulatoryAreaEntity =
            RegulatoryAreaEntity(id = id, tags = listOf(), themes = listOf())
    }
}
