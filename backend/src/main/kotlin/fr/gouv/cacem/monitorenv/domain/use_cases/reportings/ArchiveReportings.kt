package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class ArchiveReportings(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(ArchiveReportings::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(ids: List<Int>) {
        logger.info("Archive reportings: $ids")

        require(ids.isNotEmpty()) { "No reportings to archive" }
        return reportingRepository.archiveReportings(ids)
    }
}
