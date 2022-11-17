package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Repository
class JpaMissionRepository(private val dbMissionRepository: IDBMissionRepository,
                           private val mapper: ObjectMapper
) : IMissionRepository {

  override fun findMissions(afterDateTime: Instant,
                            beforeDateTime: Instant,
                            pageable: Pageable): List<MissionEntity> {
    return dbMissionRepository.findAllMissions(afterDateTime,
      beforeDateTime,pageable).map { it.toMissionEntity(mapper) }
  }

  override fun findMissionById(missionId: Int): MissionEntity {
    return dbMissionRepository.findById(missionId).get().toMissionEntity(mapper)
  }

  override fun count() : Long {
    return dbMissionRepository.count()
  }

  @Transactional
  override fun save(mission: MissionEntity): MissionEntity {
    return dbMissionRepository.save(MissionModel.fromMissionEntity(mission,mapper)).toMissionEntity(mapper)
  }

  @Transactional
  override fun create(mission: MissionEntity): MissionEntity {
    return dbMissionRepository.save(MissionModel.fromMissionEntity(mission,mapper)).toMissionEntity(mapper)
  }

  @Transactional
  override fun delete(missionId: Int) {
    dbMissionRepository.deleteMission(missionId)
  }
}
