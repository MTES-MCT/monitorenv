package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.ControlResourceOrUnitNotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.InfractionsObservationsReportModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBInfractionsObservationsReportRepository
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaInfractionsObservationsReportRepository(
    private val dbInfractionsObservationsReportRepository: IDBInfractionsObservationsReportRepository,
) : IInfractionsObservationsReportRepository {
    override fun findInfractionsObservationsReportById(InfractionsObservationsReportId: Int): InfractionsObservationsReportEntity {
        return dbInfractionsObservationsReportRepository.findById(InfractionsObservationsReportId).get().toInfractionsObservationsReport()
    }

    override fun findAllInfractionsObservationsReports(pageable: Pageable): List<InfractionsObservationsReportEntity> {
        return dbInfractionsObservationsReportRepository.findAllInfractionsObservationsReports(pageable).map { it.toInfractionsObservationsReport() }
    }

    @Transactional
    override fun save(infractionsObservationsReport: InfractionsObservationsReportEntity): InfractionsObservationsReportEntity {
        return try {
            val infractionsObservationsReportModel = InfractionsObservationsReportModel.fromInfractionsObservationsReportEntity(infractionsObservationsReport)
            dbInfractionsObservationsReportRepository.save(infractionsObservationsReportModel).toInfractionsObservationsReport()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw ControlResourceOrUnitNotFoundException("Invalid control unit or resource id: not found in referential", e)
        }
    }

    @Transactional
    override fun delete(InfractionsObservationsReportId: Int) {
        dbInfractionsObservationsReportRepository.deleteInfractionsObservationsReport(InfractionsObservationsReportId)
    }

    override fun count(): Long {
        return dbInfractionsObservationsReportRepository.count()
    }
}
