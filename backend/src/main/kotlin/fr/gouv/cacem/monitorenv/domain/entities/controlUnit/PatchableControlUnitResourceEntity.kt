package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

import java.util.Optional

data class PatchableControlUnitResourceEntity(
    val radioFrequency: Optional<String>?,
    val registrationId: Optional<String>?,
)
