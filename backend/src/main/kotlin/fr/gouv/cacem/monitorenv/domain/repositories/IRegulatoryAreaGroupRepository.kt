package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO

interface IRegulatoryAreaGroupRepository {
    fun findAll(filters: SearchFilters): List<RegulatoryAreaGroupDTO>

    fun findGroupById(id: Int): RegulatoryAreaGroupDTO?

    fun findGroupByRegulatoryAreaId(regulatoryAreaId: Int): RegulatoryAreaEntity?

    /** Returns the group only if exactly one group matches */
    fun findGroupByLayerNameAndLocation(
        layerName: String,
        location: String?,
    ): RegulatoryAreaEntity?

    fun findAllLayerNames(): List<RegulatoryAreaGroupWithTotalDTO>

    /**
     * Saves the group and, in the same transaction, the given regulatory areas of the group.
     * For [regulatoryAreasToUpdate], only the propagated fields (see [PropagatedFieldEnum])
     * and the inherited fields are written.
     */
    fun save(
        regulatoryAreaGroup: RegulatoryAreaGroupEntity,
        regulatoryAreasToUpdate: List<RegulatoryAreaEntity>,
    ): RegulatoryAreaGroupDTO
}
