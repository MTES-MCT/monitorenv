package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMissionWithActionsAndAttachedReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.GetRecentControlsActivity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.recentActivity.RecentControlsActivityDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity.RecentControlsActivityDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/recent-activity")
@Tag(description = "API Recent Activity", name = "BFF.RecentActivity")
class RecentActivity(
    private val getRecentControlActivity: GetRecentControlsActivity,
) {
    private val logger =
        LoggerFactory.getLogger(
            CreateOrUpdateMissionWithActionsAndAttachedReporting::class.java,
        )

    @PostMapping("/controls")
    @Operation(summary = "Get recent activity for controls")
    fun get(
        @RequestBody params: RecentControlsActivityDataInput,
    ): List<RecentControlsActivityDataOutput> {
        val recentControlsActivity =
            getRecentControlActivity.execute(
                administrationIds = params.administrationIds,
                controlUnitIds = params.controlUnitIds,
                geometry = params.geometry,
                startedAfter = params.startedAfter,
                startedBefore = params.startedBefore,
                themeIds = params.themeIds,
            )

        return recentControlsActivity.map {
            RecentControlsActivityDataOutput.fromRecentControlsActivityDTO(it)
        }
    }
}
