package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import tools.jackson.databind.json.JsonMapper

@Repository
class JpaRegulatoryAreaGroupRepository(
    private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository,
    private val dbRegulatoryAreaGroupRepository: IDBRegulatoryAreaGroupRepository,
    private val mapper: JsonMapper,
) : IRegulatoryAreaGroupRepository {
    override fun findAllLayerNames(): Map<String, Long> =
        dbRegulatoryAreaGroupRepository.findAllLayerNames().associate { row ->
            row[0] as String to row[1] as Long
        }

    override fun findGroupById(id: Int): RegulatoryAreaGroupDTO? {
        val regulatoryAreas = dbRegulatoryAreaGroupRepository.findAllByGroupId(id)
        if (regulatoryAreas.isEmpty()) return null

        val group = regulatoryAreas.first().group
        val areas = regulatoryAreas.map { it.regulatoryArea.toRegulatoryArea(mapper) }

        return RegulatoryAreaGroupDTO(
            group = group.toRegulatoryArea(mapper),
            areas = areas,
        )
    }

    @Transactional
    override fun save(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO {
        val idsToUpdate = regulatoryAreaGroup.regulatoryAreaIds + regulatoryAreaGroup.id
        dbRegulatoryAreaRepository.updateGroupTypeAndLocation(
            layerName = regulatoryAreaGroup.type,
            location = regulatoryAreaGroup.location,
            ids = idsToUpdate,
        )
        dbRegulatoryAreaGroupRepository.deleteAllByGroupId(regulatoryAreaGroup.id)
        val regulatoryAreaGroupModels =
            regulatoryAreaGroup.regulatoryAreaIds.map {
                RegulatoryAreaGroupModel(
                    id =
                        RegulatoryAreaGroupPk(
                            regulatoryAreaId = it,
                            groupId = regulatoryAreaGroup.id,
                        ),
                    regulatoryArea = dbRegulatoryAreaRepository.getReferenceById(it),
                    group = dbRegulatoryAreaRepository.getReferenceById(regulatoryAreaGroup.id),
                )
            }
        val savedRegulatoryAreaGroup = dbRegulatoryAreaGroupRepository.saveAll(regulatoryAreaGroupModels)
        val group = savedRegulatoryAreaGroup.first().group
        val areas = savedRegulatoryAreaGroup.map { it.regulatoryArea.toRegulatoryArea(mapper) }

        return RegulatoryAreaGroupDTO(
            group = group.toRegulatoryArea(mapper),
            areas = areas,
        )
    }
}
