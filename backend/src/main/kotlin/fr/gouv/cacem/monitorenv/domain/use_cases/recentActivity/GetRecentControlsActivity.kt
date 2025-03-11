package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.recentActivity.InfractionEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import org.locationtech.jts.geom.Geometry
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetRecentControlsActivity(private val envActionRepository: IEnvActionRepository) {
    private val logger = LoggerFactory.getLogger(GetRecentControlsActivity::class.java)

    fun execute(
        administrationIds: List<Int>?,
        controlUnitIds: List<Int>?,
        geometry: Geometry?,
        infractionsStatus: List<InfractionEnum>?,
        themeIds: List<Int>?,
        startedAfter: ZonedDateTime?,
        startedBefore: ZonedDateTime?,
    ): List<RecentControlsActivityListDTO> {
        logger.info("Attempt to get recent controls activity")

        val recentControlsActivityList =
            envActionRepository.getRecentControlsActivity(
                administrationIds = administrationIds,
                controlUnitIds = controlUnitIds,
                geometry = geometry,
                infractionsStatus = infractionsStatus,
                themeIds = themeIds,
                startedAfter =
                    startedAfter?.toInstant()
                        ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBefore?.toInstant() ?: ZonedDateTime.now().toInstant(),
            )

        logger.info("Found ${recentControlsActivityList.size} recentControlsActivity with criteria")

        return recentControlsActivityList
    }
}
