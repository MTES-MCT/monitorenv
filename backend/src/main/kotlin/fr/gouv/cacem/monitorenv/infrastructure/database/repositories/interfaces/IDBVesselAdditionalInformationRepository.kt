package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselAdditionalInformationModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBVesselAdditionalInformationRepository : JpaRepository<VesselAdditionalInformationModel, Int> {
    fun findByShipIdAndBatchIdAndRowNumber(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
    ): VesselAdditionalInformationModel?
}
