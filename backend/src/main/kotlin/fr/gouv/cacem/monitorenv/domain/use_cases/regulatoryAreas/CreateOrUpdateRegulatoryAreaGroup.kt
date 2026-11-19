package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagationOptionEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateRegulatoryAreaGroup(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateRegulatoryAreaGroup::class.java)

    fun execute(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO {
        logger.info("Attempt to CREATE or UPDATE regulatory area group ${regulatoryAreaGroup.layerName}")

        try {
            val fieldsToCopy = getFieldsToCopy(regulatoryAreaGroup)
            val savedRegulatoryAreaGroup = regulatoryAreaGroupRepository.save(regulatoryAreaGroup, fieldsToCopy)
            logger.info(
                "Regulatory Area group ${regulatoryAreaGroup.layerName} created or updated, fields copied to its regulatory areas: $fieldsToCopy",
            )
            return savedRegulatoryAreaGroup
        } catch (e: Exception) {
            val errorMessage = "Regulatory Area group ${regulatoryAreaGroup.layerName} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }

    private fun getFieldsToCopy(regulatoryAreaGroup: RegulatoryAreaGroupEntity): Set<PropagatedFieldEnum> {
        val enabledOptions = regulatoryAreaGroup.propagation.filterValues { it.enabled }
        if (enabledOptions.isEmpty() || regulatoryAreaGroup.regulatoryAreaIds.isEmpty()) {
            return emptySet()
        }

        // The current values of the regulatory areas are re-read here: the front may have an outdated view of them
        val regulatoryAreas = regulatoryAreaRepository.findAllByIds(regulatoryAreaGroup.regulatoryAreaIds)

        return enabledOptions.filter { (field, option) -> shouldCopy(field, option, regulatoryAreas) }.keys
    }

    private fun shouldCopy(
        field: PropagatedFieldEnum,
        option: PropagationOptionEntity,
        regulatoryAreas: List<RegulatoryAreaEntity>,
    ): Boolean =
        when (option.overwriteExisting) {
            true -> true

            // The user chose to keep the current values: the group value will only apply to future regulatory areas
            false -> false

            // The question was not asked: copy only if there is nothing to overwrite
            null -> regulatoryAreas.none { field.hasData(it) }
        }
}
