package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselAdditionalInformationEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselIdEntity

interface IVesselRepository {
    fun findVesselByVesselId(vesselId: VesselIdEntity): VesselEntity?

    fun search(searched: String): List<VesselEntity>

    fun saveAdditionalInformation(
        vesselId: VesselIdEntity,
        vesselAdditionalInformation: VesselAdditionalInformationEntity,
    ): VesselAdditionalInformationEntity

    fun saveFiles(
        vesselId: VesselIdEntity,
        vesselFiles: List<VesselFileEntity>,
    ): List<VesselFileEntity>
}
