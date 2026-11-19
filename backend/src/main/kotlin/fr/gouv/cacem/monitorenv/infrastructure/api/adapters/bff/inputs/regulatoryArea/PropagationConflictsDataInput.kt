package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum

data class PropagationConflictsDataInput(
    val regulatoryAreaIds: List<Int>,
    val fields: List<PropagatedFieldEnum>,
)
