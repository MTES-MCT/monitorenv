package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VesselModel
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface DBVesselRepository : CrudRepository<VesselModel, Int> {
    @Query(
        value =
            """
                SELECT vessel FROM VesselModel vessel WHERE vessel.shipName LIKE CONCAT('%', UPPER(:searched), '%')
                    OR vessel.imo LIKE %:searched%
                    OR vessel.immatriculation LIKE %:searched% 
                    OR vessel.mmsi LIKE %:searched%
                    """,
    )
    fun searchBy(
        @Param("searched") searched: String,
    ): List<VesselModel>
}
