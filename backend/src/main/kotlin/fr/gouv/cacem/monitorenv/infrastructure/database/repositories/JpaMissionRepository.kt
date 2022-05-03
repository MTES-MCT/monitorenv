package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.NewMissionEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel

import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaMissionRepository(private val dbMissionRepository: IDBMissionRepository) : IMissionRepository {

  override fun findMissions(): List<MissionEntity> {
    return dbMissionRepository.findAllByOrderByIdAsc().map { it.toMission() }
  }

  override fun findMissionById(missionId: Int): MissionEntity {
    return dbMissionRepository.findById(missionId).get().toMission()
  }

  @Transactional
  override fun save(mission: MissionEntity): MissionEntity {
    return dbMissionRepository.save(MissionModel.fromMissionEntity(mission)).toMission()
  }

  @Transactional
  override fun create(mission: MissionEntity): MissionEntity {
    return dbMissionRepository.save(MissionModel.fromMissionEntity(mission)).toMission()
  }
}
