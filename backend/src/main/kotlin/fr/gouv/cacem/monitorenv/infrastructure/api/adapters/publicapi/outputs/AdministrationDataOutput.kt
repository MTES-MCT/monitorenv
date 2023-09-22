package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.utils.requireNotNullList

data class AdministrationDataOutput(
    val id: Int,
    val controlUnitIds: List<Int>,
    val controlUnits: List<ControlUnitEntity>? = null,
    val name: String,
) {
    companion object {
        fun fromAdministration(administration: AdministrationEntity): AdministrationDataOutput {
            return AdministrationDataOutput(
                id = requireNotNull(administration.id),
                controlUnitIds = requireNotNullList(administration.controlUnitIds),
                name = administration.name,
            )
        }

        fun fromFullAdministration(fullAdministration: FullAdministrationDTO): AdministrationDataOutput {
            return AdministrationDataOutput(
                id = requireNotNull(fullAdministration.id),
                controlUnits = fullAdministration.controlUnits,
                controlUnitIds = fullAdministration.controlUnitIds,
                name = fullAdministration.name,
            )
        }
    }
}
