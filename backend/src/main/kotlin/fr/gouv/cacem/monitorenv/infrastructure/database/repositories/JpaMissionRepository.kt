package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.ControlResourceOrUnitNotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaMissionRepository(
    private val dbMissionRepository: IDBMissionRepository,
    private val mapper: ObjectMapper,
) : IMissionRepository {

    override fun findAllMissions(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>?,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<MissionEntity> {
        val missionSourcesAsStringArray = missionSources?.map { it.name }
        return dbMissionRepository.findAllMissions(
            startedAfter = startedAfter,
            startedBefore = startedBefore,
            missionTypes = convertToPGArray(missionTypes),
            missionStatuses = convertToPGArray(missionStatuses),
            missionSources = convertToPGArray(missionSourcesAsStringArray),
            seaFronts = convertToPGArray(seaFronts),
            pageable = pageable,
        ).map { it.toMissionEntity(mapper) }
    }

    override fun findMissionById(missionId: Int): MissionEntity {
        return dbMissionRepository.findById(missionId).get().toMissionEntity(mapper)
    }

    override fun count(): Long {
        return dbMissionRepository.count()
    }

    @Transactional
    override fun save(mission: MissionEntity): MissionEntity {
        return try {
            val missionModel = MissionModel.fromMissionEntity(mission, mapper)
            dbMissionRepository.save(missionModel).toMissionEntity(mapper)
        } catch (e: InvalidDataAccessApiUsageException) {
            throw ControlResourceOrUnitNotFoundException("Invalid control unit or resource id: not found in referential", e)
        }
    }

    @Transactional
    override fun delete(missionId: Int) {
        dbMissionRepository.deleteMission(missionId)
    }

    private fun convertToPGArray(array: List<String>?): String {
        return array?.joinToString(separator = ",", prefix = "{", postfix = "}")?: "{}"
    }
}
