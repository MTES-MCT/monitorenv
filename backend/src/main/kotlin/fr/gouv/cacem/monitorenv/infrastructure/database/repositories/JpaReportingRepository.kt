package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import java.time.Instant
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaReportingRepository(
        private val dbReportingRepository: IDBReportingRepository,
        private val dbMissionRepository: IDBMissionRepository,
        private val dbSemaphoreRepository: IDBSemaphoreRepository,
        private val dbControlUnitRepository: IDBControlUnitRepository,
        private val mapper: ObjectMapper,
) : IReportingRepository {
    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun attachReportingsToMission(reportingIds: List<Int>, missionId: Int) {
        dbReportingRepository.attachReportingsToMission(reportingIds, missionId)
    }

    override fun findById(reportingId: Int): ReportingDTO {
        return dbReportingRepository.findById(reportingId).get().toReportingDTO(mapper)
    }

    override fun findAll(
            pageable: Pageable,
            reportingType: List<ReportingTypeEnum>?,
            seaFronts: List<String>?,
            sourcesType: List<SourceTypeEnum>?,
            startedAfter: Instant,
            startedBefore: Instant?,
            status: List<String>?,
    ): List<ReportingDTO> {
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
                .map { it.toReportingDTO(mapper) }
    }

    override fun findByControlUnitId(controlUnitId: Int): List<ReportingEntity> {
        return dbReportingRepository.findByControlUnitId(controlUnitId).map { it.toReporting() }
    }

    override fun findByMissionId(missionId: Int): List<ReportingDTO> {
        return dbReportingRepository.findByMissionId(missionId).map { it.toReportingDTO(mapper) }
    }

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun save(reporting: ReportingEntity): ReportingDTO {
        return try {
            val semaphoreReference =
                    if (reporting.semaphoreId != null) {
                        dbSemaphoreRepository.getReferenceById(
                                reporting.semaphoreId,
                        )
                    } else {
                        null
                    }
            val controlUnitReference =
                    if (reporting.controlUnitId != null) {
                        dbControlUnitRepository.getReferenceById(
                                reporting.controlUnitId,
                        )
                    } else {
                        null
                    }
            val missionReference =
                    if (reporting.missionId != null) {
                        dbMissionRepository.getReferenceById(
                                reporting.missionId,
                        )
                    } else {
                        null
                    }
            val reportingModel =
                    ReportingModel.fromReportingEntity(
                            reporting = reporting,
                            semaphoreReference = semaphoreReference,
                            controlUnitReference = controlUnitReference,
                            missionReference = missionReference,
                    )
            dbReportingRepository.saveAndFlush(reportingModel).toReportingDTO(mapper)
        } catch (e: JpaObjectRetrievalFailureException) {
            throw NotFoundException(
                    "Invalid reference to semaphore, control unit or mission: not found in referential",
                    e,
            )
        } catch (e: DataIntegrityViolationException) {
            throw NotFoundException("Invalid combination of mission and/or envAction", e)
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
