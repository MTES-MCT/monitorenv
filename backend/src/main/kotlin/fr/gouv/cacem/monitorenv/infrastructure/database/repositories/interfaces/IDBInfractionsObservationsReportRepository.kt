package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.InfractionsObservationsReportModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBInfractionsObservationsReportRepository : CrudRepository<InfractionsObservationsReportModel, Int> {

    @Query(
        value = """
        SELECT *
        FROM infractions_observations_reports
        WHERE is_deleted IS FALSE
        
    """,
        nativeQuery = true,
    )
    fun findAllInfractionsObservationsReports(pageable: Pageable): List<InfractionsObservationsReportModel>

    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE infractions_observations_reports
        SET is_deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun deleteInfractionsObservationsReport(id: Int)
}
