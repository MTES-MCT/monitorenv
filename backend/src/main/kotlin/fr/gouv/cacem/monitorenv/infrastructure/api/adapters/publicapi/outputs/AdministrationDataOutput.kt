package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import fr.gouv.cacem.monitorenv.utils.requireNotNullList

data class AdministrationDataOutput(
    val id: Int,
    val controlUnits: List<NextControlUnitEntity>,
    val controlUnitIds: List<Int>,
    val name: String,
) {
    companion object {
        fun fromAdministrationEntity(
            administration: AdministrationEntity,
            controlUnitService: ControlUnitService
        ): AdministrationDataOutput {
            val controlUnits =
                controlUnitService.getByIds(requireNotNullList(administration.controlUnitIds))

            return AdministrationDataOutput(
                id = requireNonNull(administration.id),
                controlUnits,
                controlUnitIds = requireNotNullList(administration.controlUnitIds),
                name = administration.name,
            )
        }
    }
}
