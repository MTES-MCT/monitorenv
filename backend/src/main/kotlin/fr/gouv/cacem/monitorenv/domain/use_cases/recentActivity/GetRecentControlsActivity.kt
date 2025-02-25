package fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import java.time.ZonedDateTime

@UseCase
class GetRecentControlsActivity(private val envActionRepository: IEnvActionRepository) {
    fun execute(
        startedAfter: ZonedDateTime? = null,
        startedBefore: ZonedDateTime? = null,
        infractionsStatus: List<String>? = listOf(),
        controlUnitIds: List<Int>? = listOf(),
        administrationIds: List<Int>? = listOf(),
    ): List<RecentControlsActivityListDTO> {
        return envActionRepository.getRecentControlsActivity(
            startedAfter =
                startedAfter?.toInstant()
                    ?: ZonedDateTime.now().minusDays(30).toInstant(),
            startedBefore = startedBefore?.toInstant() ?: ZonedDateTime.now().toInstant(),
            infractionsStatus = infractionsStatus ?: listOf("WITH_INFRACTIONS", "WITHOUT_INFRACTIONS"),
            controlUnitIds = controlUnitIds,
            administrationIds = administrationIds,
        )
    }
}
