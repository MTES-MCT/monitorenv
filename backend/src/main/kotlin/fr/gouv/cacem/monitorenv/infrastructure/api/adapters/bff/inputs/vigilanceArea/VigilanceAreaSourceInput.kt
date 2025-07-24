package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInputV2
import java.util.UUID

data class VigilanceAreaSourceInput(
    val id: UUID?,
    val controlUnitContacts: List<CreateOrUpdateControlUnitContactDataInputV2>?,
    val name: String?,
    val email: String?,
    val phone: String?,
) {
    fun toVigilanceAreaSourceEntity(): VigilanceAreaSourceEntity {
        return VigilanceAreaSourceEntity(
            id = id,
            name = name,
            email = email,
            phone = phone,
            controlUnitContacts = controlUnitContacts?.map { it.toControlUnitContact() }
        )
    }
}