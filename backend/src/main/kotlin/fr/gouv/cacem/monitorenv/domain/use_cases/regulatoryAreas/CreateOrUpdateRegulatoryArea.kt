package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
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

    fun execute(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity {
        logger.info("Attempt to CREATE or UPDATE regulatory area ${regulatoryArea.id}")

        try {
            val savedRegulatoryArea = regulatoryAreaRepository.save(withGroupDefaultValues(regulatoryArea))
            logger.info("Regulatory Area ${savedRegulatoryArea.id} created or updated")
            return savedRegulatoryArea
        } catch (e: Exception) {
            val errorMessage = "Regulatory Area ${regulatoryArea.id} couldn't be saved"
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, message = errorMessage)
        }
    }

    /**
     * When a regulatory area joins a group, it receives the default values of the group
     * for the fields it does not fill itself.
     */
    private fun withGroupDefaultValues(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity {
        val layerName = regulatoryArea.layerName ?: return regulatoryArea
        val group =
            regulatoryAreaGroupRepository.findGroupByLayerNameAndLocation(layerName, regulatoryArea.location)
                ?: return regulatoryArea
        if (group.propagatedFields.isEmpty()) {
            return regulatoryArea
        }

        val previousGroup = regulatoryAreaGroupRepository.findGroupByRegulatoryAreaId(regulatoryArea.id)
        if (previousGroup?.id == group.id) {
            return regulatoryArea
        }

        logger.info("Regulatory area ${regulatoryArea.id} joins group ${group.id}: applying ${group.propagatedFields}")

        return group.propagatedFields
            .filterNot { it.hasData(regulatoryArea) }
            .fold(regulatoryArea) { area, field -> field.copy(from = group, to = area) }
    }
}
