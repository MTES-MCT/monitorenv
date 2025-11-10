package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselModel
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface IDBVesselRepository : CrudRepository<VesselModel, Int> {
    @Query(
        value =
            """
                SELECT vessel FROM VesselModel vessel
                WHERE vessel.isBanned IS FALSE AND vessel.status = 'A'
                    AND (vessel.batchId IS NULL OR vessel.batchId = 
                        (SELECT MAX(batchVessel.batchId) FROM VesselModel batchVessel 
                            WHERE batchVessel.shipId = vessel.shipId))
                    AND (vessel.rowNumber IS NULL OR vessel.rowNumber = 
                        (SELECT MAX(rowVessel.rowNumber) FROM VesselModel rowVessel 
                            WHERE rowVessel.shipId = vessel.shipId AND rowVessel.batchId = 
                                (SELECT MAX(maxBatchVesselPerRowNumber.batchId) FROM VesselModel maxBatchVesselPerRowNumber)))
                    AND (
                        UPPER(vessel.shipName) LIKE CONCAT('%', UPPER(:searched), '%')
                        OR UPPER(vessel.imo) LIKE CONCAT('%', UPPER(:searched), '%')
                        OR UPPER(vessel.immatriculation) LIKE CONCAT('%', UPPER(:searched), '%')
                        OR UPPER(vessel.mmsi) LIKE CONCAT('%', UPPER(:searched), '%')
                    ) ORDER BY vessel.shipName ASC
                    """,
    )
    fun searchBy(
        @Param("searched") searched: String,
    ): List<VesselModel>
}
