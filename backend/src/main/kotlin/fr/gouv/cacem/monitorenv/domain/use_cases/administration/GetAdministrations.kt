package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetAdministrations(private val administrationRepository: IAdministrationRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<FullAdministrationDTO> {
        val fullAdministrations = administrationRepository.findAll()

        logger.info("Found ${fullAdministrations.size} administrations.")

        return fullAdministrations
    }
}
