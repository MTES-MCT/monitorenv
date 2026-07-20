package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

class RegulatoryAreaFixture {
    companion object {
        fun aRegulatoryArea(
            id: Int = 1,
            areaType: AreaTypeEnum = AreaTypeEnum.ZONE,
            facade: String = "NAMO",
            layerName: String? = "Layername 1",
            plan: String = "PIRC",
        ): RegulatoryAreaEntity =
            RegulatoryAreaEntity(
                id = id,
                areaType = areaType,
                tags = listOf(),
                themes = listOf(),
                facade = facade,
                layerName = layerName,
                location = null,
                plan = plan,
            )

        fun aRegulatoryAreaGroupDTO(): RegulatoryAreaGroupDTO =
            RegulatoryAreaGroupDTO(
                group = aRegulatoryArea(),
                areas = listOf(aRegulatoryArea()),
            )

        fun aRegulatoryAreaGroupEntity(): RegulatoryAreaGroupEntity =
            RegulatoryAreaGroupEntity(
                id = 1,
                location = null,
                type = "Layer 1",
                regulatoryAreaIds = listOf(2, 3),
            )
    }
}
