package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionTagModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBMissionTagsRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Repository

@Repository
class JpaMissionTagsRepository(
    private val dbMissionTagsRepository: IDBMissionTagsRepository,
) : IMissionTagsRepository {
    @Transactional
    override fun findAll(): List<MissionTagEntity> = dbMissionTagsRepository.findAll().map { it.toMissiontagEntity() }

    @Transactional
    override fun findAllUnarchived(): List<MissionTagEntity> =
        dbMissionTagsRepository.findAllByIsArchivedIsFalse().map { it.toMissiontagEntity() }

    @Transactional
    override fun save(missionTagEntity: MissionTagEntity): MissionTagEntity =
        dbMissionTagsRepository.save(MissionTagModel.fromMissionTagEntity(missionTagEntity)).toMissiontagEntity()
}
