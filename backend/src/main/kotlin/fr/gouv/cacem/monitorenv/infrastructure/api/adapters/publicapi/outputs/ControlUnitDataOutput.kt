package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.services.AdministrationService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.services.BaseService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administration: AdministrationEntity,
    val administrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<ControlUnitContactEntity>,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromNextControlUnitEntity(
            controlUnit: NextControlUnitEntity,
            administrationService: AdministrationService,
            controlUnitContactService: ControlUnitContactService,
            controlUnitResourceService: ControlUnitResourceService,
            baseService: BaseService,
        ): ControlUnitDataOutput {
            val administration =
                administrationService.getById(controlUnit.administrationId)
            val controlUnitContacts =
                controlUnitContactService.getByIds(controlUnit.controlUnitContactIds)
            val controlUnitResources =
                controlUnitResourceService.getByIds(controlUnit.controlUnitResourceIds).map {
                    // TODO Make that non-nullable once all resources will have been attached to a base.
                    it.copy(base = it.baseId?.let { baseId -> baseService.getById(baseId).toBase() })
                }

            return ControlUnitDataOutput(
                id = requireNonNull(controlUnit.id),
                areaNote = controlUnit.areaNote,
                administration,
                administrationId = controlUnit.administrationId,
                controlUnitContactIds = controlUnit.controlUnitContactIds,
                controlUnitContacts,
                controlUnitResourceIds = controlUnit.controlUnitResourceIds,
                controlUnitResources,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )
        }
    }
}
