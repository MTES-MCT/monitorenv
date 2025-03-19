package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.slf4j.LoggerFactory

@UseCase
class GetAdministrationById(
    private val administrationRepository: IAdministrationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAdministrationById::class.java)

    fun execute(administrationId: Int): FullAdministrationDTO {
        logger.info("GET administration $administrationId")
        return administrationRepository.findById(administrationId)
    }
}
