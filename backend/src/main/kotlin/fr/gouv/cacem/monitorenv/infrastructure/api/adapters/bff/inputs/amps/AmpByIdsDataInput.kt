package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.amps

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum

data class AmpByIdsDataInput(
    val ids: List<Int>,
    val axis: AxisEnum,
)
