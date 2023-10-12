package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.ControlResourceOrUnitNotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.BaseModel
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.FullMissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaMissionRepository(
    private val dbBaseRepository: JpaBaseRepository,
    private val dbMissionRepository: IDBMissionRepository,
    private val mapper: ObjectMapper,
) : IMissionRepository {
    override fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>?,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<FullMissionDTO> {
        val missionSourcesAsStringArray = missionSources?.map { it.name }
        return dbMissionRepository.findAll(
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            missionTypes = convertToPGArray(missionTypes),
            missionStatuses = convertToPGArray(missionStatuses),
            missionSources = convertToPGArray(missionSourcesAsStringArray),
            seaFronts = convertToPGArray(seaFronts),
            pageable = pageable,
        ).map { it.toFullMissionDTO(mapper) }
    }

    override fun findById(missionId: Int): FullMissionDTO {
        return dbMissionRepository.findById(missionId).get().toFullMissionDTO(mapper)
    }

    override fun count(): Long {
        return dbMissionRepository.count()
    }

    @Transactional
    override fun save(mission: MissionEntity): FullMissionDTO {
        return try {
            // Extract all control units resources unique baseIds
            val uniqueBaseIds = mission.controlUnits.flatMap { controlUnit ->
                controlUnit.resources.map { it.baseId }
            }.distinct()
            // Fetch all of them as models
            val baseModels = dbBaseRepository.findAllById(uniqueBaseIds).map { BaseModel.fromFullBase(it) }
            // Create a `[baseId] → BaseModel` map
            val baseModelMap = baseModels.associateBy { requireNotNull(it.id) }

            val missionModel = MissionModel.fromMissionEntity(mission, mapper, baseModelMap)
            dbMissionRepository.save(missionModel).toFullMissionDTO(mapper)
        } catch (e: Exception) {
            when (e) {
                // TODO Is `InvalidDataAccessApiUsageException` necessary?
                is DataIntegrityViolationException, is InvalidDataAccessApiUsageException -> {
                    throw ControlResourceOrUnitNotFoundException(
                        "Invalid control unit or resource id: not found in referential.",
                        e,
                    )
                }

                else -> throw e
            }
        }
    }

    @Transactional
    override fun delete(missionId: Int) {
        dbMissionRepository.delete(missionId)
    }

    private fun convertToPGArray(array: List<String>?): String {
        return array?.joinToString(separator = ",", prefix = "{", postfix = "}") ?: "{}"
    }
}
