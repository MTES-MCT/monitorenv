package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface IDBVesselRepository : JpaRepository<VesselModel, Int> {
    @Query(
        value =
            """
                SELECT vessel FROM VesselModel vessel
                WHERE vessel.shipId = :shipId 
                    AND vessel.batchId = :batchId
                    AND vessel.rowNumber = :rowNumber
                     """,
    )
    fun findByShipIdAndBatchIdAndRowNumber(
        @Param("shipId") shipId: Int,
        @Param("batchId") batchId: Int?,
        @Param("rowNumber") rowNumber: Int?,
    ): VesselModel?
}
