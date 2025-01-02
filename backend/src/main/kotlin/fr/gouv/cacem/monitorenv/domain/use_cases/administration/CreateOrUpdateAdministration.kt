package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateAdministration(private val administrationRepository: IAdministrationRepository) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateAdministration::class.java)

    fun execute(administration: AdministrationEntity): AdministrationEntity {
        logger.info("Attempt to CREATE or UPDATE administration ${administration.id}")
        val administrationEntity = administrationRepository.save(administration)
        logger.info("Created or updated administration ${administrationEntity.id}")

        return administrationEntity
    }
}
