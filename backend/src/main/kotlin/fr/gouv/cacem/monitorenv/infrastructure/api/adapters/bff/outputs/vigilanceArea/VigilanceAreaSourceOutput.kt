package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaSourceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitContactDataOutput
import java.util.UUID

data class VigilanceAreaSourceOutput(
    val id: UUID?,
    val controlUnitContacts: List<ControlUnitContactDataOutput>?,
    val name: String?,
    val email: String?,
    val phone: String?,
) {
    companion object {
        fun fromVigilanceAreaSourceEntity(vigilanceAreaSource: VigilanceAreaSourceEntity): VigilanceAreaSourceOutput =
            VigilanceAreaSourceOutput(
                id = vigilanceAreaSource.id,
                name = vigilanceAreaSource.name,
                email = vigilanceAreaSource.email,
                phone = vigilanceAreaSource.phone,
                controlUnitContacts =
                    vigilanceAreaSource.controlUnitContacts?.map {
                        ControlUnitContactDataOutput.fromControlUnitContact(
                            it,
                        )
                    },
            )
    }
}
