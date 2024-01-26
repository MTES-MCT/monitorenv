package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanTagRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
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
    ): List<MissionDTO> {
        val pageable = if (pageNumber != null && pageSize != null) { PageRequest.of(pageNumber, pageSize) } else { Pageable.unpaged() }
        return dbMissionRepository.findAll(
            controlUnitIds = controlUnitIds,
            missionSources = missionSources,
            missionStatuses = (missionStatuses),
            missionTypeAIR = MissionTypeEnum.AIR in missionTypes.orEmpty(),
            missionTypeLAND = MissionTypeEnum.LAND in missionTypes.orEmpty(),
            missionTypeSEA = MissionTypeEnum.SEA in missionTypes.orEmpty(),
            pageable = pageable,
            seaFronts = seaFronts,
            startedAfter = startedAfter,
            startedBefore = startedBefore,
        )
            .map { it.toMissionDTO(mapper) }
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
    ): List<MissionEntity> {
        val pageable = if (pageNumber != null && pageSize != null) { PageRequest.of(pageNumber, pageSize) } else { Pageable.unpaged() }

        val missions = dbMissionRepository.findAll(
            controlUnitIds = controlUnitIds,
            missionSources = missionSources,
            missionStatuses = (missionStatuses),
            missionTypeAIR = MissionTypeEnum.AIR in missionTypes.orEmpty(),
            missionTypeLAND = MissionTypeEnum.LAND in missionTypes.orEmpty(),
            missionTypeSEA = MissionTypeEnum.SEA in missionTypes.orEmpty(),
            pageable = pageable,
            seaFronts = seaFronts,
            startedAfter = startedAfter,
            startedBefore = startedBefore,
        )

        return missions.map { it.toMissionEntity(mapper) }
    }

    @Transactional
    override fun findFullMissionById(missionId: Int): MissionDTO {
        return dbMissionRepository.findById(missionId).get().toMissionDTO(mapper)
    }

    @Transactional
    override fun findById(missionId: Int): MissionEntity {
        return dbMissionRepository.findById(missionId).get().toMissionEntity(mapper)
    }

    @Transactional
    override fun save(mission: MissionEntity): MissionDTO {
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
            controlPlanThemes?.distinct()?.associateWith { id ->
                dbControlPlanThemeRepository.getReferenceById(id)
            }
        // Create a map from controlPlanSubThemes mapping each id to a reference to the model
        val controlPlanSubThemesReferenceModelMap =
            controlPlanSubThemes?.distinct()?.associateWith { id ->
                dbControlPlanSubThemeRepository.getReferenceById(id)
            }
        // Create a map from controlPlanTags mapping each id to a reference to the model
        val controlPlanTagsReferenceModelMap =
            controlPlanTags?.distinct()?.associateWith { id ->
                dbControlPlanTagRepository.getReferenceById(id)
            }

        val missionModel =
            MissionModel.fromMissionEntity(
                mission = mission,
                controlUnitResourceModelMap = controlUnitResourceModelMap,
                controlPlanThemesReferenceModelMap = controlPlanThemesReferenceModelMap
                    ?: emptyMap(),
                controlPlanSubThemesReferenceModelMap =
                controlPlanSubThemesReferenceModelMap ?: emptyMap(),
                controlPlanTagsReferenceModelMap = controlPlanTagsReferenceModelMap
                    ?: emptyMap(),
                mapper = mapper,
            )
        return dbMissionRepository.saveAndFlush(missionModel).toMissionDTO(mapper)
    }
}
