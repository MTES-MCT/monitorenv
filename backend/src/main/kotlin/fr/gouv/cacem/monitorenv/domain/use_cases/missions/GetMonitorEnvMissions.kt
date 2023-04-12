package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import java.time.ZonedDateTime

@UseCase
class GetMonitorEnvMissions(private val missionRepository: IMissionRepository) {
    private val logger = LoggerFactory.getLogger(GetMonitorEnvMissions::class.java)

    fun execute(
        startedAfterDateTime: ZonedDateTime?,
        startedBeforeDateTime: ZonedDateTime?,
        missionNatures: List<String>?,
        missionSources: List<MissionSourceEnum>?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        pageNumber: Int?,
        pageSize: Int?
    ): List<MissionEntity> {
        val missions = missionRepository.findAllMissions(
            startedAfter = startedAfterDateTime?.toInstant() ?: ZonedDateTime.now().minusDays(30).toInstant(),
            startedBefore = startedBeforeDateTime?.toInstant(),
            missionNatures = missionNatures,
            missionTypes = missionTypes,
            missionStatuses = missionStatuses,
            missionSources = missionSources ?: listOf(MissionSourceEnum.MONITORENV, MissionSourceEnum.MONITORFISH),
            pageable = if (pageNumber != null && pageSize != null) PageRequest.of(pageNumber, pageSize) else Pageable.unpaged()
        )

        logger.info("Found ${missions.size} missions ")

        return missions
    }
}
