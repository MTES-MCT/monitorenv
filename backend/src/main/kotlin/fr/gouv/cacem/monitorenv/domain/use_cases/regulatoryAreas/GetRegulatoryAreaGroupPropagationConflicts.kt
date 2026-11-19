package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.PropagationConflictDTO
import org.slf4j.LoggerFactory

/**
 * For each field, counts the regulatory areas that already hold a value, i.e. the ones whose value
 * would be overwritten by the value of the group.
 */
@UseCase
class GetRegulatoryAreaGroupPropagationConflicts(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetRegulatoryAreaGroupPropagationConflicts::class.java)

    fun execute(
        regulatoryAreaIds: List<Int>,
        fields: List<PropagatedFieldEnum>,
    ): Map<PropagatedFieldEnum, PropagationConflictDTO> {
        logger.info("GET propagation conflicts of fields $fields for regulatory areas $regulatoryAreaIds")
        val regulatoryAreas =
            if (regulatoryAreaIds.isEmpty() || fields.isEmpty()) {
                listOf()
            } else {
                regulatoryAreaRepository.findAllByIds(regulatoryAreaIds)
            }

        return fields.associateWith { field ->
            PropagationConflictDTO(
                regulatoryAreasWithExistingData = regulatoryAreas.count { field.hasData(it) },
                totalRegulatoryAreas = regulatoryAreas.size,
            )
        }
    }
}
