package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AdministrationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

@DynamicUpdate
interface IDBAdministrationRepository : JpaRepository<AdministrationModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value = """
        UPDATE administrations
        SET is_archived = TRUE
        WHERE id = :administrationId
        """,
        nativeQuery = true,
    )
    fun archiveById(administrationId: Int)

    @Query(
        value = """
        SELECT *
        FROM administrations
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<AdministrationModel>
}
