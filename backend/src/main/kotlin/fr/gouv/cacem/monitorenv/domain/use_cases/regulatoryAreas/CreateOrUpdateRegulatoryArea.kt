package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedValuesEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateRegulatoryArea(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateRegulatoryArea::class.java)

    /**
     * @param inheritedFields fields for which the regulatory area uses the group value.
     * `null` keeps the current ones. Ignored when the regulatory area joins a group: it then inherits
     * all the fields propagated by the group.
     */
    fun execute(
        regulatoryArea: RegulatoryAreaEntity,
        inheritedFields: List<PropagatedFieldEnum>? = null,
    ): RegulatoryAreaEntity {
        logger.info("Attempt to CREATE or UPDATE regulatory area ${regulatoryArea.id}")

        try {
            val savedRegulatoryArea =
                regulatoryAreaRepository.save(withGroupInheritance(regulatoryArea, inheritedFields))
            logger.info("Regulatory Area ${savedRegulatoryArea.id} created or updated")
            return savedRegulatoryArea
        } catch (e: Exception) {
            val errorMessage = "Regulatory Area ${regulatoryArea.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }

    private fun withGroupInheritance(
        regulatoryArea: RegulatoryAreaEntity,
        inheritedFields: List<PropagatedFieldEnum>?,
    ): RegulatoryAreaEntity {
        val group =
            regulatoryArea.layerName?.let {
                regulatoryAreaGroupRepository.findGroupByLayerNameAndLocation(it, regulatoryArea.location)
            } ?: return regulatoryArea.copy(inheritedFields = listOf())

        val previousGroup = regulatoryAreaGroupRepository.findGroupByRegulatoryAreaId(regulatoryArea.id)
        val nextInheritedFields =
            if (previousGroup?.id != group.id) {
                logger.info("Regulatory area ${regulatoryArea.id} joins group ${group.id}")
                group.propagatedFields
            } else {
                (inheritedFields ?: regulatoryAreaRepository.findById(regulatoryArea.id)?.inheritedFields.orEmpty())
                    .filter { it in group.propagatedFields }
            }

        // The inherited fields always hold the group value, whatever value was sent
        val groupValues = PropagatedValuesEntity.fromRegulatoryArea(group)
        return nextInheritedFields.fold(regulatoryArea.copy(inheritedFields = listOf())) { area, field ->
            field.inherit(groupValues, area)
        }
    }
}
