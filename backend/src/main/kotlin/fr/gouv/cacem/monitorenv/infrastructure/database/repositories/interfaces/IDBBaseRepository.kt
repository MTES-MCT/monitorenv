package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.BaseModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBBaseRepository : CrudRepository<BaseModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        DELETE
        FROM bases
        WHERE id = :id
        """,
        nativeQuery = true,
    )
    override fun deleteById(id: Int)

    @Query(
        value = """
        SELECT *
        FROM bases
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<BaseModel>
}
