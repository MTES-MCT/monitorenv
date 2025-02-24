package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.GetRecentControlActivity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity.RecentControlsActivityDataOutput
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/bff/v1/recent-activity")
@Tag(description = "API Recent Activity", name = "BFF.RecentActivity")
class RecentActivity(
    private val getRecentControlActivity: GetRecentControlActivity,
) {
    @GetMapping("/controls")
    @Operation(summary = "Get recent activity for controls")
    fun get(): List<RecentControlsActivityDataOutput> {
        val recentControlsActivity = getRecentControlActivity.execute()
        return recentControlsActivity.map { RecentControlsActivityDataOutput.fromRecentControlsActivityDTO(it) }
    }
}
