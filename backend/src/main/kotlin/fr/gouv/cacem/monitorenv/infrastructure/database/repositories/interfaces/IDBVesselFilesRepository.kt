package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselFileModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBVesselFilesRepository : JpaRepository<VesselFileModel, Int> {
    fun findAllByShipIdAndBatchIdAndRowNumber(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
    ): MutableList<VesselFileModel>

    fun deleteAllByShipIdAndBatchIdAndRowNumber(
        shipId: Int,
        batchId: Int?,
        rowNumber: Int?,
    )
}
