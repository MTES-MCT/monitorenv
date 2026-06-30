package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveVesselFiles(
    private val vesselRepository: IVesselRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveVesselFiles::class.java)

    fun execute(
        vesselId: VesselIdEntity,
        vesselFiles: List<VesselFileEntity>,
    ): List<VesselFileEntity> {
        logger.info("Attempt to CREATE or UPDATE vessel file ${vesselFiles.map { it.name }} from vessel $vesselId")
        val savedVesselFile = vesselRepository.saveFiles(vesselId = vesselId, vesselFiles = vesselFiles)
        logger.info("Vessel file ${savedVesselFile.map { it.name }} from vessel $vesselId created or updated")

        return savedVesselFile
    }
}
