package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitContactDataOutput
import java.util.UUID

data class VigilanceAreaSourceOutput(
    val id: UUID?,
    val comments: String?,
    val controlUnitContacts: List<ControlUnitContactDataOutput>?,
    val name: String?,
    val link: String?,
    val email: String?,
    val phone: String?,
    val type: SourceTypeEnum?,
    val isAnonymous: Boolean?,
) {
    companion object {
        fun fromVigilanceAreaSourceEntity(vigilanceAreaSource: VigilanceAreaSourceEntity): VigilanceAreaSourceOutput =
            VigilanceAreaSourceOutput(
                id = vigilanceAreaSource.id,
                name = vigilanceAreaSource.name,
                email = vigilanceAreaSource.email,
                phone = vigilanceAreaSource.phone,
                type = vigilanceAreaSource.type,
                link = vigilanceAreaSource.link,
                comments = vigilanceAreaSource.comments,
                isAnonymous = vigilanceAreaSource.isAnonymous,
                controlUnitContacts =
                    vigilanceAreaSource.controlUnitContacts?.map {
                        ControlUnitContactDataOutput.fromControlUnitContact(
                            it,
                        )
                    },
            )
    }
}
