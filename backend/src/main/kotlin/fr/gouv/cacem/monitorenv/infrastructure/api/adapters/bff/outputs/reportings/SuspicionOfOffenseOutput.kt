package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfOffense

class SuspicionOfOffenseOutput(
    val amount: Long,
    val themes: List<String>,
) {
    companion object {
        fun fromSuspicionOfOffense(suspicionOfOffense: SuspicionOfOffense): SuspicionOfOffenseOutput =
            SuspicionOfOffenseOutput(
                amount = suspicionOfOffense.amount,
                themes = suspicionOfOffense.themes?.toList() ?: emptyList(),
            )
    }
}
