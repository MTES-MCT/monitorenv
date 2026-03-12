package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.LatestVesselModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface IDBLatestVesselRepository : JpaRepository<LatestVesselModel, Int> {
    @Query(
        value =
            """
                SELECT vessel FROM LatestVesselModel vessel
                WHERE 
                     UPPER(vessel.shipName) LIKE CONCAT('%', UPPER(:searched), '%')
                     OR UPPER(vessel.imo) LIKE CONCAT('%', UPPER(:searched), '%')
                     OR UPPER(vessel.immatriculation) LIKE CONCAT('%', UPPER(:searched), '%')
                     OR UPPER(vessel.mmsi) LIKE CONCAT('%', UPPER(:searched), '%')
                ORDER BY vessel.shipName, vessel.mmsi, vessel.immatriculation, vessel.imo ASC LIMIT 50""",
    )
    fun searchBy(
        @Param("searched") searched: String,
    ): List<LatestVesselModel>
}
