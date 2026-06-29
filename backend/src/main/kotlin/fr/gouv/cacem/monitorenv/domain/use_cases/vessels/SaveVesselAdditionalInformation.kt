package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveVesselAdditionalInformation(
    private val vesselRepository: IVesselRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveVesselAdditionalInformation::class.java)

    fun execute(
        vesselId: VesselIdEntity,
        vesselAdditionalInformation: VesselAdditionalInformationEntity,
    ): VesselAdditionalInformationEntity {
        logger.info("Attempt to CREATE or UPDATE vessel additional information from vessel: $vesselId")
        val savedAdditionalInformation =
            vesselRepository.saveAdditionalInformation(
                vesselId = vesselId,
                vesselAdditionalInformation = vesselAdditionalInformation,
            )
        logger.info("Vessel additional information from vessel: $vesselId created or updated")

        return savedAdditionalInformation
    }
}
