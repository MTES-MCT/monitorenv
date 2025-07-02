package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfInfractions

class SuspicionOfInfractionsOutput(
    val ids: List<Int>,
    val themes: List<String>,
) {
    companion object {
        fun fromSuspicionOfInfractions(suspicionOfInfractions: SuspicionOfInfractions): SuspicionOfInfractionsOutput =
            SuspicionOfInfractionsOutput(
                ids = suspicionOfInfractions.ids?.toList() ?: emptyList(),
                themes = suspicionOfInfractions.themes?.toList() ?: emptyList(),
            )
    }
}
