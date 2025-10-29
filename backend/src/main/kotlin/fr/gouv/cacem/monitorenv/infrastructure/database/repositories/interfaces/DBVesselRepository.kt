package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselModel
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface DBVesselRepository : CrudRepository<VesselModel, Int> {
    @Query(
        value =
            """
                SELECT vessel FROM VesselModel vessel WHERE vessel.isBanned IS FALSE AND UPPER(vessel.shipName) LIKE CONCAT('%', UPPER(:searched), '%')
                    OR UPPER(vessel.imo) LIKE CONCAT('%', UPPER(:searched), '%')
                    OR UPPER(vessel.immatriculation) LIKE CONCAT('%', UPPER(:searched), '%')
                    OR UPPER(vessel.mmsi) LIKE CONCAT('%', UPPER(:searched), '%')
                    """,
    )
    fun searchBy(
        @Param("searched") searched: String,
    ): List<VesselModel>
}
