package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagationOptionEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

class RegulatoryAreaFixture {
    companion object {
        fun aRegulatoryArea(
            id: Int = 1,
            areaType: AreaTypeEnum = AreaTypeEnum.ZONE,
            facade: String = "NAMO",
            layerName: String? = "Layername 1",
            plan: String = "PIRC",
            location: String? = null,
            tags: List<TagEntity> = listOf(),
            themes: List<ThemeEntity> = listOf(),
            resume: String? = null,
            authorizationPeriods: String? = null,
            prohibitionPeriods: String? = null,
            propagatedFields: List<PropagatedFieldEnum> = listOf(),
            inheritedFields: List<PropagatedFieldEnum> = listOf(),
        ): RegulatoryAreaEntity =
            RegulatoryAreaEntity(
                id = id,
                areaType = areaType,
                tags = tags,
                themes = themes,
                resume = resume,
                authorizationPeriods = authorizationPeriods,
                prohibitionPeriods = prohibitionPeriods,
                propagatedFields = propagatedFields,
                inheritedFields = inheritedFields,
                facade = facade,
                layerName = layerName,
                location = location,
                plan = plan,
            )

        fun aRegulatoryAreaGroupDTO(
            layerName: String? = "Layername 1",
            areas: List<RegulatoryAreaEntity>? = null,
        ): RegulatoryAreaGroupDTO =
            RegulatoryAreaGroupDTO(
                group = aRegulatoryArea(layerName = layerName),
                areas = areas ?: listOf(aRegulatoryArea(layerName = layerName)),
            )

        fun aRegulatoryAreaGroupEntity(
            regulatoryAreaIds: List<Int> = listOf(2, 3),
            propagation: Map<PropagatedFieldEnum, PropagationOptionEntity> = mapOf(),
        ): RegulatoryAreaGroupEntity =
            RegulatoryAreaGroupEntity(
                id = 1,
                location = null,
                layerName = "Layer 1",
                regulatoryAreaIds = regulatoryAreaIds,
                propagation = propagation,
                date = null,
                dateFin = null,
                type = null,
                url = null,
                refReg = null,
                additionalRefReg = null,
            )
    }
}
