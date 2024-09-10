package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AbstractReportingModel.Companion.fromReportingEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingSourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingsControlPlanSubThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBEnvActionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBReportingRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.apache.commons.lang3.StringUtils
import org.locationtech.jts.geom.Geometry
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Repository
class JpaReportingRepository(
    private val dbReportingRepository: IDBReportingRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val dbControlPlanThemeRepository: IDBControlPlanThemeRepository,
    private val dbControlPlanSubThemeRepository: IDBControlPlanSubThemeRepository,
    private val dbEnvActionRepository: IDBEnvActionRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbSemaphoreRepository: IDBSemaphoreRepository,
    private val mapper: ObjectMapper,
) : IReportingRepository {

    @Transactional
    override fun attachEnvActionsToReportings(envActionId: UUID, reportingIds: List<Int>) {
        dbReportingRepository.attachEnvActionsToReportings(envActionId, reportingIds)
    }

    @Transactional
    override fun attachReportingsToMission(reportingIds: List<Int>, missionId: Int) {
        dbReportingRepository.attachReportingsToMission(reportingIds, missionId)
    }

    @Transactional
    override fun detachDanglingEnvActions(missionId: Int, envActionIds: List<UUID>) {
        dbReportingRepository.detachDanglingEnvActions(missionId, envActionIds)
    }

    // FIXME (25/07/2024) : passer par le findByIdOrNull et refacto
    override fun findById(reportingId: Int): ReportingDTO {
        return dbReportingRepository.findById(reportingId).get().toReportingDTO(mapper)
    }

    @Transactional
    override fun findAll(
        pageNumber: Int?,
        pageSize: Int?,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>?,
        targetTypes: List<TargetTypeEnum>?,
        isAttachedToMission: Boolean?,
        searchQuery: String?,
    ): List<ReportingDTO> {
        val pageable = if (pageNumber != null && pageSize != null) {
            PageRequest.of(pageNumber, pageSize)
        } else {
            Pageable.unpaged()
        }
        return dbReportingRepository.findAll(
            pageable,
            reportingType = reportingType,
            seaFronts = seaFronts,
            sourcesType = sourcesType,
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            status = status,
            targetTypes = targetTypes,
            isAttachedToMission = isAttachedToMission,
        )
            .map { it.toReportingDTO(mapper) }.filter { findBySearchQuery(it.reporting, searchQuery) }
    }

    private fun findBySearchQuery(reporting: ReportingEntity, searchQuery: String?): Boolean {
        if (searchQuery.isNullOrBlank()) {
            return true
        }

        return reporting.targetDetails?.any { targetDetail ->
            listOf(
                targetDetail.imo,
                targetDetail.mmsi,
                targetDetail.externalReferenceNumber,
                targetDetail.vesselName,
                targetDetail.operatorName,
                targetDetail.vesselType?.name,
            ).any { field ->
                !field.isNullOrBlank() && normalizeField(field)
                    .contains(normalizeField(searchQuery), ignoreCase = true)
            }
        } ?: false
    }

    private fun normalizeField(input: String): String {
        return StringUtils.stripAccents(input.replace(" ", ""))
    }

    @Transactional
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
            val missionReference =
                if (reporting.missionId != null) {
                    dbMissionRepository.getReferenceById(
                        reporting.missionId,
                    )
                } else {
                    null
                }
            val envActionReference =
                if (reporting.attachedEnvActionId != null) {
                    dbEnvActionRepository.getReferenceById(
                        reporting.attachedEnvActionId,
                    )
                } else {
                    null
                }
            val controlPlanThemeReference =
                if (reporting.themeId != null) {
                    dbControlPlanThemeRepository.getReferenceById(
                        reporting.themeId,
                    )
                } else {
                    null
                }
            val controlPlanSubThemesReferenceList =
                reporting.subThemeIds?.map {
                    dbControlPlanSubThemeRepository.getReferenceById(it)
                }

            // To save controlPlanSubThemes we must ensure that reportingId is set
            // to simplify the understandability of the code, we do the same steps for creation and
            // update
            // even if it is not necessary for update
            // first save (ensure id is set)
            val reportingModel: ReportingModel

            if (reporting.id == null) {
                reportingModel =
                    dbReportingRepository.save(
                        fromReportingEntity(
                            reporting = reporting,
                            missionReference = missionReference,
                            envActionReference = envActionReference,
                            controlPlanThemeReference = controlPlanThemeReference,
                        ),
                    )
            } else {
                reportingModel =
                    fromReportingEntity(
                        reporting = reporting,
                        missionReference = missionReference,
                        envActionReference = envActionReference,
                        controlPlanThemeReference = controlPlanThemeReference,
                    )
            }

            val reportingsSourceModels = reporting.reportingSources.map {
                val controlUnitReference = if (it.controlUnitId != null) {
                    dbControlUnitRepository.getReferenceById(it.controlUnitId)
                } else {
                    null
                }
                val semaphoreReference = if (it.semaphoreId != null) {
                    dbSemaphoreRepository.getReferenceById(it.semaphoreId)
                } else {
                    null
                }
                return@map ReportingSourceModel.fromReportingSourceEntity(
                    reportingSource = it,
                    controlUnit = controlUnitReference,
                    semaphore = semaphoreReference,
                    reporting = reportingModel,
                )
            }
            reportingModel.reportingSources.addAll(reportingsSourceModels)

            // set controlPlanSubThemes and save again (and flush)
            controlPlanSubThemesReferenceList?.forEach {
                reportingModel.controlPlanSubThemes?.add(
                    ReportingsControlPlanSubThemeModel.fromModels(reportingModel, it),
                )
            }

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

    override fun findAllByGeometry(geometry: Geometry): List<ReportingEntity> {
        val reportings = dbReportingRepository.findAllByGeom(geometry = geometry)
        return reportings.map { it.toReporting() }
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
}
