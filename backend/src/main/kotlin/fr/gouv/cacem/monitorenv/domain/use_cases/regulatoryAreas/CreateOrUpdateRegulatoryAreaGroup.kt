package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedValuesEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import org.slf4j.LoggerFactory

/**
 * Saves a group and updates the regulatory areas of the group, field by field:
 * - field newly enabled on the group: the "overwrite?" answer decides which regulatory areas inherit it
 *   (yes: all of them, no: none, no answer: the ones without their own value);
 * - field already enabled: the regulatory areas inheriting it receive the new group value;
 * - field disabled: the regulatory areas inheriting it stop inheriting and keep the last group value.
 * The regulatory areas that do not inherit a field are never changed.
 */
@UseCase
class CreateOrUpdateRegulatoryAreaGroup(
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateRegulatoryAreaGroup::class.java)

    fun execute(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO {
        logger.info("Attempt to CREATE or UPDATE regulatory area group ${regulatoryAreaGroup.layerName}")

        try {
            val regulatoryAreasToUpdate = getRegulatoryAreasToUpdate(regulatoryAreaGroup)
            val savedRegulatoryAreaGroup =
                regulatoryAreaGroupRepository.save(regulatoryAreaGroup, regulatoryAreasToUpdate)
            logger.info(
                "Regulatory Area group ${regulatoryAreaGroup.layerName} created or updated, " +
                    "regulatory areas updated: ${regulatoryAreasToUpdate.map { it.id }}",
            )
            return savedRegulatoryAreaGroup
        } catch (e: Exception) {
            val errorMessage = "Regulatory Area group ${regulatoryAreaGroup.layerName} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }

    private fun getRegulatoryAreasToUpdate(regulatoryAreaGroup: RegulatoryAreaGroupEntity): List<RegulatoryAreaEntity> {
        if (regulatoryAreaGroup.regulatoryAreaIds.isEmpty()) {
            return emptyList()
        }

        val previousPropagatedFields =
            regulatoryAreaGroup.id
                ?.let { regulatoryAreaGroupRepository.findGroupById(it) }
                ?.group
                ?.propagatedFields
                ?.toSet()
                .orEmpty()
        val groupValues = PropagatedValuesEntity.fromRegulatoryAreaGroup(regulatoryAreaGroup)
        // The current values of the regulatory areas are re-read here: the front may have an outdated view of them
        val regulatoryAreas = regulatoryAreaRepository.findAllByIds(regulatoryAreaGroup.regulatoryAreaIds)

        return regulatoryAreas
            .map { regulatoryArea ->
                PropagatedFieldEnum.entries.fold(regulatoryArea) { area, field ->
                    updateField(field, area, regulatoryAreaGroup, previousPropagatedFields, groupValues)
                }
            }.filterIndexed { index, updatedRegulatoryArea -> updatedRegulatoryArea != regulatoryAreas[index] }
    }

    private fun updateField(
        field: PropagatedFieldEnum,
        regulatoryArea: RegulatoryAreaEntity,
        regulatoryAreaGroup: RegulatoryAreaGroupEntity,
        previousPropagatedFields: Set<PropagatedFieldEnum>,
        groupValues: PropagatedValuesEntity,
    ): RegulatoryAreaEntity {
        val isEnabled = field in regulatoryAreaGroup.propagatedFields
        val wasEnabled = field in previousPropagatedFields
        val isInherited = field in regulatoryArea.inheritedFields

        return when {
            // Field already enabled: only the regulatory areas using the group value follow it
            isEnabled && wasEnabled -> {
                if (isInherited) field.inherit(groupValues, regulatoryArea) else regulatoryArea
            }

            // Field newly enabled: the answer to "overwrite?" decides
            isEnabled -> {
                val shouldInherit =
                    when (regulatoryAreaGroup.propagation[field]?.overwriteExisting) {
                        true -> true

                        false -> false

                        // The question was not asked as there was nothing to overwrite.
                        // A regulatory area which got its own value meanwhile keeps it.
                        null -> !field.hasData(regulatoryArea)
                    }
                if (shouldInherit) field.inherit(groupValues, regulatoryArea) else regulatoryArea
            }

            // Field disabled: the regulatory areas keep the last group value as their own value
            isInherited -> {
                field.stopInheriting(regulatoryArea)
            }

            else -> {
                regulatoryArea
            }
        }
    }
}
