@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
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
        missionSources: List<MissionSourceEnum>?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
    ): List<MissionDTO> {
        val missions = missionRepository.findAll(
            startedAfter = startedAfterDateTime?.toInstant() ?: ZonedDateTime.now().minusDays(30).toInstant(),
            startedBefore = startedBeforeDateTime?.toInstant(),
            missionTypes = missionTypes,
            missionStatuses = missionStatuses,
            missionSources = missionSources ?: listOf(MissionSourceEnum.MONITORENV, MissionSourceEnum.MONITORFISH),
            seaFronts = seaFronts,
            pageable = if (pageNumber != null && pageSize != null) {
                PageRequest.of(
                    pageNumber,
                    pageSize,
                )
            } else {
                Pageable.unpaged()
            },
        )

        logger.info("Found ${missions.size} mission(s)")

        return missions
    }
}
