package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AdministrationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBAdministrationRepository : CrudRepository<AdministrationModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        DELETE
        FROM administrations
        WHERE id = :id
        """,
        nativeQuery = true,
    )
    override fun deleteById(id: Int)

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
