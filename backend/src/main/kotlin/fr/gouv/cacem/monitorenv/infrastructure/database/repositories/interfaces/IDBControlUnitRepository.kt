package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

@DynamicUpdate
interface IDBControlUnitRepository : JpaRepository<ControlUnitModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value = """
        UPDATE control_units
        SET archived = TRUE
        WHERE id = :controlUnitId
        """,
        nativeQuery = true,
    )
    fun archiveById(controlUnitId: Int)

    @Query(
        value = """
        SELECT controlUnit
        FROM ControlUnitModel controlUnit
        ORDER BY controlUnit.name
        """,
    )
    override fun findAll(): List<ControlUnitModel>
}
