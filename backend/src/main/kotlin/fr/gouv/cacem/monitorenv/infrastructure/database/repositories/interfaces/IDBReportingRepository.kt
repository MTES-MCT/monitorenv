package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBReportingRepository : CrudRepository<ReportingModel, Int> {

    @Query(
        value = """
        SELECT *
        FROM reportings
        WHERE is_deleted IS FALSE
        
    """,
        nativeQuery = true,
    )
    fun findAll(pageable: Pageable): List<ReportingModel>

    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE reportings
        SET is_deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)

    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE reportings
        SET is_archived = TRUE
        WHERE (created_at + make_interval(hours => validity_time)) < NOW()  
    """,
        nativeQuery = true,
    )
    fun archiveOutdatedReportings(): Int
}
