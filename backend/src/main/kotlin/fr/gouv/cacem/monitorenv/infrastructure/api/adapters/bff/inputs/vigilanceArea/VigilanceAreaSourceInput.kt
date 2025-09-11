package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInputV2
import java.util.UUID

data class VigilanceAreaSourceInput(
    val id: UUID?,
    val comments: String?,
    val controlUnitContacts: List<CreateOrUpdateControlUnitContactDataInputV2>?,
    val name: String?,
    val email: String?,
    val link: String?,
    val phone: String?,
    val type: SourceTypeEnum,
    val isAnonymous: Boolean,
) {
    fun toVigilanceAreaSourceEntity(): VigilanceAreaSourceEntity =
        VigilanceAreaSourceEntity(
            id = id,
            name = name,
            email = email,
            phone = phone,
            controlUnitContacts = controlUnitContacts?.map { it.toControlUnitContact() },
            link = link,
            comments = comments,
            type = type,
            isAnonymous = isAnonymous,
        )
}
