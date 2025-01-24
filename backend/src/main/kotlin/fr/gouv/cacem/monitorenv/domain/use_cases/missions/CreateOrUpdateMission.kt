package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher

@UseCase
class CreateOrUpdateMission(
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
    private val postgisFunctionRepository: IPostgisFunctionRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateMission::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(mission: MissionEntity): MissionEntity {
        logger.info("Attempt to CREATE or UPDATE mission ${mission.id}")

        val normalizedMission =
            mission.geom?.let { nonNullGeom ->
                mission.copy(
                    geom = postgisFunctionRepository.normalizeMultipolygon(nonNullGeom),
                )
            }
                ?: mission

        val facade =
            normalizedMission.geom?.let { nonNullGeom ->
                facadeRepository.findFacadeFromGeometry(nonNullGeom)
            }
        val storedMission = normalizedMission.id?.let { id -> missionRepository.findById(id) }

        val missionToSave =
            normalizedMission.copy(
                facade = facade,
                observationsByUnit = storedMission?.observationsByUnit,
                envActions = storedMission?.envActions,
            )
        val savedMission = missionRepository.save(missionToSave)

        logger.info("Mission ${savedMission.mission.id} created or updated")
        if (savedMission.mission.id == null) {
            throw IllegalArgumentException("Mission id is null")
        }

        if (mission.id != null) {
            try {
                logger.info("Sending CREATE/UPDATE event for mission id ${savedMission.mission.id}.")
                eventPublisher.publishEvent(
                    UpdateMissionEvent(savedMission.mission),
                )
            } catch (e: Exception) {
                logger.warn("Failed to send event for mission id ${savedMission.mission.id}.", e)
            }
        }

        return savedMission.mission
    }
}
