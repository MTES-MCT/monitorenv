package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import java.util.UUID

data class VigilanceAreaSourceEntity(
    val id: UUID?,
    val comments: String?,
    val controlUnitContacts: List<ControlUnitContactEntity>?,
    val name: String?,
    val email: String?,
    val link: String?,
    val phone: String?,
    val type: SourceTypeEnum,
    val isAnonymous: Boolean,
)
