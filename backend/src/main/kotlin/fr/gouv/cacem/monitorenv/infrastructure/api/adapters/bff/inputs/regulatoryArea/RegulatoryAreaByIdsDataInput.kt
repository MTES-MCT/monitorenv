package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum

data class RegulatoryAreaByIdsDataInput(
    val ids: List<Int>,
    val axis: AxisEnum,
)
