package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingSourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingSourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingSourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaReportingSourceRepository(
    private val dbReportingSourceRepository: IDBReportingSourceRepository,
    private val dbReportingRepository: IDBReportingRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbSemaphoreRepository: IDBSemaphoreRepository,
) : IReportingSourceRepository {
    @Transactional
    override fun save(reportingSourceEntity: ReportingSourceEntity): ReportingSourceDTO {
        val semaphore =
            if (reportingSourceEntity.semaphoreId != null) {
                dbSemaphoreRepository.getReferenceById(reportingSourceEntity.semaphoreId)
            } else {
                null
            }

        val controlUnit =
            if (reportingSourceEntity.controlUnitId != null) {
                dbControlUnitRepository.getReferenceById(reportingSourceEntity.controlUnitId)
            } else {
                null
            }

        val reportingModel =
            if (reportingSourceEntity.reportingId != null) {
                dbReportingRepository.getReferenceById(reportingSourceEntity.reportingId)
            } else {
                throw BackendUsageException(
                    BackendUsageErrorCode.ENTITY_NOT_FOUND,
                    "Trying to save a reporting source without a report",
                )
            }

        return dbReportingSourceRepository
            .save(
                ReportingSourceModel.fromReportingSourceEntity(
                    reportingSourceEntity,
                    semaphore,
                    controlUnit,
                    reporting = reportingModel,
                ),
            ).toReportingSourceDTO()
    }
}
