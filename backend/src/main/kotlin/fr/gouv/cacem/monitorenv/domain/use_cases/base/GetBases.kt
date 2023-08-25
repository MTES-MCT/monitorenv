package fr.gouv.cacem.monitorenv.domain.use_cases.base

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import org.slf4j.LoggerFactory

@UseCase
class GetBases(private val baseRepository: IBaseRepository) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(): List<FullBaseDTO> {
        val fullBases = baseRepository.findAll()

        logger.info("Found ${fullBases.size} bases.")

        return fullBases
    }
}
