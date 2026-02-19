package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity

class RegulatoryAreaNewFixture {
    companion object {
        fun aNewRegulatoryArea(
            id: Int = 1,
            facade: String = "NAMO",
            layerName: String? = "Layername 1",
            plan: String = "PIRC",
        ): RegulatoryAreaNewEntity =
            RegulatoryAreaNewEntity(
                id = id,
                tags = listOf(),
                themes = listOf(),
                facade = facade,
                layerName = layerName,
                plan = plan,
            )
    }
}
