package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.GetRecentControlsActivity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity.RecentControlsActivityDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.ZonedDateTime

@RestController
@RequestMapping("/bff/v1/recent-activity")
@Tag(description = "API Recent Activity", name = "BFF.RecentActivity")
class RecentActivity(
    private val getRecentControlActivity: GetRecentControlsActivity,
) {
    @GetMapping("/controls")
    @Operation(summary = "Get recent activity for controls")
    fun get(
        @Parameter(description = "Controls started after date")
        @RequestParam(name = "startedAfter", required = true)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedAfter: ZonedDateTime,
        @Parameter(description = "Controls started before date")
        @RequestParam(name = "startedBefore", required = true)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        startedBefore: ZonedDateTime,
        @Parameter(description = "Infractions status")
        @RequestParam(name = "infractionsStatus", required = false)
        infractionsStatus: List<String>?,
        @Parameter(description = "Control Units ids")
        @RequestParam(name = "controlUnitIds", required = false)
        controlUnitIds: List<Int>?,
        @Parameter(description = "Administration ids")
        @RequestParam(name = "administrationIds", required = false)
        administrationIds: List<Int>?,
    ): List<RecentControlsActivityDataOutput> {
        val recentControlsActivity =
            getRecentControlActivity.execute(
                startedAfter = startedAfter,
                startedBefore = startedBefore,
                infractionsStatus = infractionsStatus,
                controlUnitIds = controlUnitIds,
                administrationIds = administrationIds,
            )
        return recentControlsActivity.map { RecentControlsActivityDataOutput.fromRecentControlsActivityDTO(it) }
    }
}
