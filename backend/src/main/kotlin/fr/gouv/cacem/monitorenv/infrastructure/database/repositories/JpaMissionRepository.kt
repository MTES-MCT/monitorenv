package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlPlanSubThemeRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaMissionRepository(
    private val dbControlPlanSubThemeRepository: IDBControlPlanSubThemeRepository,
    private val dbControlUnitResourceRepository: IDBControlUnitResourceRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val mapper: ObjectMapper,
) : IMissionRepository {
    override fun count(): Long {
        return dbMissionRepository.count()
    }

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun delete(missionId: Int) {
        dbMissionRepository.delete(missionId)
    }

    override fun findAllFullMissions(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>?,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<MissionDTO> {
        val missionSourcesAsStringArray = missionSources?.map { it.name }
        return dbMissionRepository.findAll(
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            missionTypes = convertToPGArray(missionTypes),
            missionStatuses = convertToPGArray(missionStatuses),
            missionSources = convertToPGArray(missionSourcesAsStringArray),
            seaFronts = convertToPGArray(seaFronts),
            pageable = pageable,
        )
            .map { it.toMissionDTO(mapper) }
    }

    override fun findByIds(ids: List<Int>): List<MissionEntity> {
        return dbMissionRepository.findNotDeletedByIds(ids).map { it.toMissionEntity(mapper) }
    }

    override fun findByControlUnitId(controlUnitId: Int): List<MissionEntity> {
        return dbMissionRepository.findByControlUnitId(controlUnitId).map {
            it.toMissionEntity(mapper)
        }
    }

    override fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionEntity> {
        return dbMissionRepository.findByControlUnitResourceId(controlUnitResourceId).map {
            it.toMissionEntity(mapper)
        }
    }

    override fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>?,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<MissionEntity> {
        val missionSourcesAsStringArray = missionSources?.map { it.name }
        return dbMissionRepository.findAll(
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            missionTypes = convertToPGArray(missionTypes),
            missionStatuses = convertToPGArray(missionStatuses),
            missionSources = convertToPGArray(missionSourcesAsStringArray),
            seaFronts = convertToPGArray(seaFronts),
            pageable = pageable,
        )
            .map { it.toMissionEntity(mapper) }
    }

    override fun findFullMissionById(missionId: Int): MissionDTO {
        return dbMissionRepository.findById(missionId).get().toMissionDTO(mapper)
    }

    override fun findById(missionId: Int): MissionEntity {
        return dbMissionRepository.findById(missionId).get().toMissionEntity(mapper)
    }

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    override fun save(mission: MissionEntity): MissionDTO {
        // Extract all control units resources unique control unit resource IDs
        val uniqueControlUnitResourceIds = mission.controlUnits
            .flatMap { controlUnit -> controlUnit.resources.map { it.id } }
            .distinct()
        // Fetch all of them as models
        val controlUnitResourceModels = dbControlUnitResourceRepository.findAllById(uniqueControlUnitResourceIds)
        // Create an `[id] → ControlUnitResourceModel` map
        val controlUnitResourceModelMap = controlUnitResourceModels.associateBy { requireNotNull(it.id) }

        // get a list of all controlPlanSubThemes ids used in the mission
        val controlPlanSubThemes = mission.envActions?.flatMap { it.controlPlanSubThemes?.map { id -> id.subThemeId } ?: emptyList() }?.distinct()
        // Create a map from controlPlanSubThemes maping each id to a reference to the model
        val controlPlanSubThemesReferenceModelMap = controlPlanSubThemes?.associateWith { id ->
            dbControlPlanSubThemeRepository.getReferenceById(
                id,
            )
        }

        val missionModel = MissionModel.fromMissionEntity(
            mission = mission,
            mapper = mapper,
            controlUnitResourceModelMap = controlUnitResourceModelMap,
            controlPlanSubThemesReferenceModelMap = controlPlanSubThemesReferenceModelMap ?: emptyMap(),
        )
        return dbMissionRepository.saveAndFlush(missionModel).toMissionDTO(mapper)
    }

    private fun convertToPGArray(array: List<String>?): String {
        return array?.joinToString(separator = ",", prefix = "{", postfix = "}") ?: "{}"
    }
}
