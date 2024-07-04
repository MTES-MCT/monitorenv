package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
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
    fun execute(
        mission: MissionEntity?,
    ): MissionEntity {
        require(mission != null) { "No mission to create or update" }
        val normalizedMission = mission.geom?.let { nonNullGeom ->
            mission.copy(geom = postgisFunctionRepository.normalizeMultipolygon(nonNullGeom))
        } ?: mission

        val facade = normalizedMission.geom?.let { nonNullGeom ->
            facadeRepository.findFacadeFromGeometry(nonNullGeom)
        }
        val storedMission = normalizedMission.id?.let { id -> missionRepository.findById(id) }

        val missionToSave =
            normalizedMission.copy(
                facade = facade,
                envActions = storedMission?.envActions,
            )
        val savedMission = missionRepository.save(missionToSave)

        if (savedMission.mission.id == null) {
            throw IllegalArgumentException("Mission id is null")
        }

        logger.info("Sending CREATE/UPDATE event for mission id ${savedMission.mission.id}.")
        eventPublisher.publishEvent(
            UpdateMissionEvent(savedMission.mission),
        )

        /**
         * TODO When doing an update, the `createdAtUtc` field is returned as null.
         * To fix this, we return the stored `createdAtUtc`
         */
        return savedMission.mission.copy(
            createdAtUtc = savedMission.mission.createdAtUtc ?: storedMission?.createdAtUtc,
        )
    }
}
