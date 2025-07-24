package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import java.util.UUID

data class VigilanceAreaSourceEntity(
    val id: UUID?,
    val controlUnitContacts: List<ControlUnitContactEntity>?,
    val name: String?,
    val email: String?,
    val phone: String?,
)
