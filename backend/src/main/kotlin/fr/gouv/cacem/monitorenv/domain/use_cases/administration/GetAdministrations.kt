package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.slf4j.LoggerFactory

@UseCase
class GetAdministrations(
    private val administrationRepository: IAdministrationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAdministrations::class.java)

    fun execute(): List<FullAdministrationDTO> {
        logger.info("Attempt to GET all administrations")
        val fullAdministrations = administrationRepository.findAll()

        logger.info("Found ${fullAdministrations.size} administrations.")

        return fullAdministrations
    }
}
