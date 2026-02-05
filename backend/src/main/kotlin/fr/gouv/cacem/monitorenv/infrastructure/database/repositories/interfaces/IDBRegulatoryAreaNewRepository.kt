package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaNewRepository : JpaRepository<RegulatoryAreaNewModel, Int> {
    @Query(
        value =
            """
            SELECT * FROM regulatory_areas r
            ORDER BY r.plan
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<RegulatoryAreaNewModel>
}
