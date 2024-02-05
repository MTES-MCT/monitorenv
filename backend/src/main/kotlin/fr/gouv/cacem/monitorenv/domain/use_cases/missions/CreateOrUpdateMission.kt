@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher

@UseCase
class CreateOrUpdateMission(
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateMission::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(
        mission: MissionEntity?,
    ): MissionEntity {
        require(mission != null) { "No mission to create or update" }

        val facade = if (mission.geom != null) { facadeRepository.findFacadeFromGeometry(mission.geom) } else { null }
        val storedMission = if (mission.id != null) { missionRepository.findById(mission.id) } else { null }

        val missionToSave =
            mission.copy(
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

        return savedMission.mission
    }
}
