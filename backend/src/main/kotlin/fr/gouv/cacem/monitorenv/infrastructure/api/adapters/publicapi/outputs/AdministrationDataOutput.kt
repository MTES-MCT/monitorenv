package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.utils.requireNotNullList

data class AdministrationDataOutput(
    val id: Int,
    val controlUnitIds: List<Int>,
    val controlUnits: List<NextControlUnitEntity>? = null,
    val name: String,
) {
    companion object {
        fun fromAdministration(
            administration: AdministrationEntity,
        ): AdministrationDataOutput {
            return AdministrationDataOutput(
                id = requireNotNull(administration.id),
                controlUnitIds = requireNotNullList(administration.controlUnitIds),
                name = administration.name,
            )
        }

        fun fromFullAdministration(
            administration: FullAdministrationDTO,
        ): AdministrationDataOutput {
            return AdministrationDataOutput(
                id = requireNotNull(administration.id),
                controlUnits = administration.controlUnits,
                controlUnitIds = administration.controlUnitIds,
                name = administration.name,
            )
        }
    }
}
