package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import fr.gouv.cacem.monitorenv.utils.requireNonNullList

data class NextControlUnitAdministrationDataOutput(
    val id: Int,
    val controlUnits: List<NextControlUnitEntity>,
    val controlUnitIds: List<Int>,
    val name: String,
) {
    companion object {
        fun fromNextControlUnitAdministrationEntity(
            nextControlUnitAdministrationEntity: NextControlUnitAdministrationEntity,
            controlUnitService: ControlUnitService
        ): NextControlUnitAdministrationDataOutput {
            val controlUnits =
                controlUnitService.getByIds(requireNonNullList(nextControlUnitAdministrationEntity.controlUnitIds))

            return NextControlUnitAdministrationDataOutput(
                id = requireNonNull(nextControlUnitAdministrationEntity.id),
                controlUnits,
                controlUnitIds = requireNonNullList(nextControlUnitAdministrationEntity.controlUnitIds),
                name = nextControlUnitAdministrationEntity.name,
            )
        }
    }
}
