package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBControlUnitResourceRepository : CrudRepository<ControlUnitResourceModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE control_unit_resources
        SET is_archived = TRUE
        WHERE id = :controlUnitResourceId
        """,
        nativeQuery = true
    )
    fun archiveById(controlUnitResourceId: Int)

    @Query(
        value = """
        SELECT *
        FROM control_unit_resources
        ORDER BY name ASC
        """,
        nativeQuery = true
    )
    override fun findAll(): List<ControlUnitResourceModel>
}
