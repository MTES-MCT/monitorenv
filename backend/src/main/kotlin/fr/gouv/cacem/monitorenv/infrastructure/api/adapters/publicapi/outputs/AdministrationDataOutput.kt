package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import fr.gouv.cacem.monitorenv.utils.requireNonNullList

data class AdministrationDataOutput(
    val id: Int,
    val controlUnits: List<NextControlUnitEntity>,
    val controlUnitIds: List<Int>,
    val name: String,
) {
    companion object {
        fun fromAdministrationEntity(
            administrationEntity: AdministrationEntity,
            controlUnitService: ControlUnitService
        ): AdministrationDataOutput {
            val controlUnits =
                controlUnitService.getByIds(requireNonNullList(administrationEntity.controlUnitIds))

            return AdministrationDataOutput(
                id = requireNonNull(administrationEntity.id),
                controlUnits,
                controlUnitIds = requireNonNullList(administrationEntity.controlUnitIds),
                name = administrationEntity.name,
            )
        }
    }
}
