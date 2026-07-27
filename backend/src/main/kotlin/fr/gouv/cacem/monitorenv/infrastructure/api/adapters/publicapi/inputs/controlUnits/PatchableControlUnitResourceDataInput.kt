package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.PatchableControlUnitResourceEntity
import java.util.Optional

data class PatchableControlUnitResourceDataInput(
    val radioFrequency: Optional<String>?,
    val registrationId: Optional<String>?,
) {
    fun toControlUnitResourceEntity(): PatchableControlUnitResourceEntity =
        PatchableControlUnitResourceEntity(radioFrequency = radioFrequency, registrationId = registrationId)
}
