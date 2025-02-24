package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity

import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO

data class RecentActivityDataOutput(
    val controls: List<RecentControlsActivityDataOutput>,
) {
    companion object {
        fun fromRecentControlActivityEntity(recentControlsActivity: List<RecentControlsActivityListDTO>) =
            RecentActivityDataOutput(
                controls =
                    recentControlsActivity.map {
                        RecentControlsActivityDataOutput.fromRecentControlsActivityDTO(
                            it,
                        )
                    },
            )
    }
}
