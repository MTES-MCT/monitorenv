package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.ControlResourceOrUnitNotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaReportingRepository(
    private val dbReportingRepository: IDBReportingRepository,
) : IReportingRepository {
    override fun findById(reportingId: Int): ReportingEntity {
        return dbReportingRepository.findById(reportingId).get().toReporting()
    }

    override fun findAll(
        pageable: Pageable,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>?,
    ): List<ReportingEntity> {
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
            .map { it.toReporting() }
    }

    @Transactional
    override fun save(reporting: ReportingEntity): ReportingEntity {
        return try {
            val reportingModel = ReportingModel.fromReportingEntity(reporting)
            dbReportingRepository.save(reportingModel).toReporting()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw ControlResourceOrUnitNotFoundException(
                "Invalid control unit or resource id: not found in referential",
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

    private fun convertToString(array: List<String>?): String {
        return array?.joinToString(separator = ",", prefix = "{", postfix = "}") ?: "{}"
    }
}
