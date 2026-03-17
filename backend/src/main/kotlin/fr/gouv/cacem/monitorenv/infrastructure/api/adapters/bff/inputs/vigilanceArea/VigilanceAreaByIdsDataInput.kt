package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum

data class VigilanceAreaByIdsDataInput(
    val ids: List<Int>,
    val axis: AxisEnum,
)
