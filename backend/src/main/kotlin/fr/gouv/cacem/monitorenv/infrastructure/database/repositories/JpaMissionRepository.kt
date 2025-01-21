package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.*
import org.apache.commons.lang3.StringUtils
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaMissionRepository(
    private val dbControlPlanThemeRepository: IDBControlPlanThemeRepository,
    private val dbControlPlanSubThemeRepository: IDBControlPlanSubThemeRepository,
    private val dbControlPlanTagRepository: IDBControlPlanTagRepository,
    private val dbControlUnitResourceRepository: IDBControlUnitResourceRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val mapper: ObjectMapper,
) : IMissionRepository {
    override fun count(): Long {
        return dbMissionRepository.count()
    }

    @Transactional
    override fun delete(missionId: Int) {
        dbMissionRepository.delete(missionId)
    }

    @Transactional
    override fun findAllFullMissions(
        controlUnitIds: List<Int>?,
        missionSources: List<MissionSourceEnum>?,
        missionStatuses: List<String>?,
        missionTypes: List<MissionTypeEnum>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        searchQuery: String?,
    ): List<MissionListDTO> {
        val pageable =
            if (pageNumber != null && pageSize != null) {
                PageRequest.of(pageNumber, pageSize)
            } else {
                Pageable.unpaged()
            }
        return dbMissionRepository.findAll(
            controlUnitIds = controlUnitIds,
            missionSources = missionSources,
            missionStatuses = missionStatuses,
            missionTypeAIR = MissionTypeEnum.AIR in missionTypes.orEmpty(),
            missionTypeLAND = MissionTypeEnum.LAND in missionTypes.orEmpty(),
            missionTypeSEA = MissionTypeEnum.SEA in missionTypes.orEmpty(),
            pageable = pageable,
            seaFronts = seaFronts,
            startedAfter = startedAfter,
            startedBefore = startedBefore,
        )
            .map { it.toMissionListDTO(mapper) }.filter { findBySearchQuery(it.mission, searchQuery) }
    }

    @Transactional
    override fun findByIds(ids: List<Int>): List<MissionEntity> {
        return dbMissionRepository.findNotDeletedByIds(ids).map { it.toMissionEntity(mapper) }
    }

    @Transactional
    override fun findByControlUnitId(controlUnitId: Int): List<MissionEntity> {
        return dbMissionRepository.findByControlUnitId(controlUnitId).map {
            it.toMissionEntity(mapper)
        }
    }

    @Transactional
    override fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionEntity> {
        return dbMissionRepository.findByControlUnitResourceId(controlUnitResourceId).map {
            it.toMissionEntity(mapper)
        }
    }

    @Transactional
    override fun findAll(
        controlUnitIds: List<Int>?,
        missionSources: List<MissionSourceEnum>?,
        missionStatuses: List<String>?,
        missionTypes: List<MissionTypeEnum>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        searchQuery: String?,
    ): List<MissionEntity> {
        val pageable =
            if (pageNumber != null && pageSize != null) {
                PageRequest.of(pageNumber, pageSize)
            } else {
                Pageable.unpaged()
            }

        val missions =
            dbMissionRepository.findAll(
                controlUnitIds = controlUnitIds,
                missionStatuses = missionStatuses,
                missionSources = missionSources,
                missionTypeAIR = MissionTypeEnum.AIR in missionTypes.orEmpty(),
                missionTypeLAND = MissionTypeEnum.LAND in missionTypes.orEmpty(),
                missionTypeSEA = MissionTypeEnum.SEA in missionTypes.orEmpty(),
                pageable = pageable,
                seaFronts = seaFronts,
                startedAfter = startedAfter,
                startedBefore = startedBefore,
            )

        return missions.map { it.toMissionEntity(mapper) }.filter { findBySearchQuery(it, searchQuery) }
    }

    fun findBySearchQuery(
        mission: MissionEntity,
        searchQuery: String?,
    ): Boolean {
        if (searchQuery.isNullOrBlank()) {
            return true
        }

        return mission.id?.toString()?.let {
            normalizeField(it)
                .contains(normalizeField(searchQuery), ignoreCase = true)
        } == true ||
            mission.envActions?.any { action ->
                (action as? EnvActionControlEntity)?.infractions?.any { infraction ->
                    listOf(
                        infraction.imo,
                        infraction.mmsi,
                        infraction.registrationNumber,
                        infraction.vesselName,
                        infraction.companyName,
                        infraction.controlledPersonIdentity,
                    ).any { field ->
                        !field.isNullOrBlank() &&
                            normalizeField(field)
                                .contains(normalizeField(searchQuery), ignoreCase = true)
                    }
                } ?: false
            } ?: false
    }

    private fun normalizeField(input: String): String {
        return StringUtils.stripAccents(input.replace(" ", ""))
    }

    @Transactional
    override fun findFullMissionById(missionId: Int): MissionDetailsDTO? {
        return dbMissionRepository.findByIdOrNull(missionId)?.toMissionDTO(mapper)
    }

    @Transactional
    override fun findById(missionId: Int): MissionEntity? {
        return dbMissionRepository.findByIdOrNull(missionId)?.toMissionEntity(mapper)
    }

    @Transactional
    override fun save(mission: MissionEntity): MissionDetailsDTO {
        // Extract all control units resources unique control unit resource IDs
        val uniqueControlUnitResourceIds =
            mission.controlUnits
                .flatMap { controlUnit -> controlUnit.resources.map { it.id } }
                .distinct()
        // Fetch all of them as models
        val controlUnitResourceModels =
            dbControlUnitResourceRepository.findAllById(uniqueControlUnitResourceIds)
        // Create an `[id] → ControlUnitResourceModel` map
        val controlUnitResourceModelMap =
            controlUnitResourceModels.associateBy { requireNotNull(it.id) }

        val controlPlanThemes = ArrayList<Int>()
        val controlPlanSubThemes = ArrayList<Int>()
        val controlPlanTags = ArrayList<Int>()
        for (envAction in mission.envActions ?: emptyList()) {
            for (controlPlan in envAction.controlPlans ?: emptyList()) {
                // get a list of all controlPlanTheme ids used in the mission's envActions
                controlPlanThemes.add(controlPlan.themeId ?: continue)
                // get a list of all controlPlanSubThemes ids used in the mission's envActions
                controlPlanSubThemes.addAll(controlPlan.subThemeIds ?: emptyList())
                // get a list of all controlPlanTags ids used in the mission's envActions
                controlPlanTags.addAll(controlPlan.tagIds ?: emptyList())
            }
        }

        // Create a map from controlPlanThemes mapping each id to a reference to the model
        val controlPlanThemesReferenceModelMap =
            controlPlanThemes.distinct().associateWith { id ->
                dbControlPlanThemeRepository.getReferenceById(id)
            }
        // Create a map from controlPlanSubThemes mapping each id to a reference to the model
        val controlPlanSubThemesReferenceModelMap =
            controlPlanSubThemes.distinct().associateWith { id ->
                dbControlPlanSubThemeRepository.getReferenceById(id)
            }
        // Create a map from controlPlanTags mapping each id to a reference to the model
        val controlPlanTagsReferenceModelMap =
            controlPlanTags.distinct().associateWith { id ->
                dbControlPlanTagRepository.getReferenceById(id)
            }

        val missionModel =
            MissionModel.fromMissionEntity(
                mission = mission,
                controlUnitResourceModelMap = controlUnitResourceModelMap,
                controlPlanThemesReferenceModelMap = controlPlanThemesReferenceModelMap,
                controlPlanSubThemesReferenceModelMap =
                controlPlanSubThemesReferenceModelMap,
                controlPlanTagsReferenceModelMap = controlPlanTagsReferenceModelMap,
                mapper = mapper,
            )
        return dbMissionRepository.saveAndFlush(missionModel).toMissionDTO(mapper)
    }
}
