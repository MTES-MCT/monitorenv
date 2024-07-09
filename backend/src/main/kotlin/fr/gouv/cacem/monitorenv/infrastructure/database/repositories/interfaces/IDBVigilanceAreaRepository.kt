package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface IDBVigilanceAreaRepository : JpaRepository<VigilanceAreaModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
        """
        UPDATE vigilance_areas
        SET is_deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)

    @Query(
        value =
        """
        SELECT *
        FROM vigilance_areas
        WHERE is_deleted IS FALSE
    """,
        nativeQuery = true,
    )
    override fun findAll(): List<VigilanceAreaModel>
}