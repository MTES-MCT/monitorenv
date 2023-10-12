package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaReportingRepository(
    private val dbReportingRepository: IDBReportingRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val dbSemaphoreRepository: IDBSemaphoreRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val mapper: ObjectMapper,
) : IReportingRepository {
    override fun findById(reportingId: Int): FullReportingDTO {
        return dbReportingRepository.findById(reportingId).get().toFullReporting(mapper)
    }

    override fun findAll(
        pageable: Pageable,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>?,
    ): List<FullReportingDTO> {
        val sourcesTypeAsStringArray = sourcesType?.map { it.name }
        val reportingTypeAsStringArray = reportingType?.map { it.name }
        return dbReportingRepository.findAll(
            pageable,
            reportingType = convertToString(reportingTypeAsStringArray),
            seaFronts = convertToString(seaFronts),
            sourcesType = convertToString(sourcesTypeAsStringArray),
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            status = convertToString(status),
        )
            .map { it.toFullReporting(mapper) }
    }

    override fun findByAttachedMissionId(missionId: Int): List<FullReportingDTO> {
        return dbReportingRepository.findByAttachedMissionId(missionId).map { it.toFullReporting(mapper) }
    }

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun save(reporting: ReportingEntity): FullReportingDTO {
        return try {
            val semaphoreReference = if (reporting.semaphoreId != null) {
                dbSemaphoreRepository.getReferenceById(
                    reporting.semaphoreId,
                )
            } else {
                null
            }
            val controlUnitReference = if (reporting.controlUnitId != null) {
                dbControlUnitRepository.getReferenceById(
                    reporting.controlUnitId,
                )
            } else {
                null
            }
            val attachedMissionReference = if (reporting.attachedMissionId != null) {
                dbMissionRepository.getReferenceById(
                    reporting.attachedMissionId,
                )
            } else {
                null
            }
            val reportingModel = ReportingModel.fromReportingEntity(
                reporting = reporting,
                semaphoreReference = semaphoreReference,
                controlUnitReference = controlUnitReference,
                attachedMissionReference = attachedMissionReference,
            )
            dbReportingRepository.saveAndFlush(reportingModel).toFullReporting(mapper)
        } catch (e: JpaObjectRetrievalFailureException) {
            throw NotFoundException(
                "Invalid reference to semaphore, control unit or mission: not found in referential",
                e,
            )
        }
    }

    @Transactional
    override fun delete(reportingId: Int) {
        dbReportingRepository.delete(reportingId)
    }

    override fun count(): Long {
        return dbReportingRepository.count()
    }

    @Transactional
    override fun archiveOutdatedReportings(): Int {
        return dbReportingRepository.archiveOutdatedReportings()
    }

    @Transactional
    override fun archiveReportings(ids: List<Int>) {
        dbReportingRepository.archiveReportings(ids)
    }

    @Transactional
    override fun deleteReportings(ids: List<Int>) {
        dbReportingRepository.deleteReportings(ids)
    }

    private fun convertToString(array: List<String>?): String {
        return array?.joinToString(separator = ",", prefix = "{", postfix = "}") ?: "{}"
    }
}
