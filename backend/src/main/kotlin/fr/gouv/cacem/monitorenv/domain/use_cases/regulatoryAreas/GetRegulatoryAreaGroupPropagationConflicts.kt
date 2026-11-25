package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.PropagationConflictDTO
import org.slf4j.LoggerFactory

/**
 * For each field, lists the regulatory areas that have their own value (i.e. they don't inherit it from the group),
 * the ones whose value would be overwritten if they started inheriting the field.
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
                regulatoryAreasWithExistingData =
                    regulatoryAreas.filter { field !in it.inheritedFields && field.hasData(it) },
                totalRegulatoryAreas = regulatoryAreas.size,
            )
        }
    }
}
