package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitAdministrationService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.domain.services.BaseService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class NextControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val controlUnitAdministration: NextControlUnitAdministrationEntity,
    val controlUnitAdministrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<NextControlUnitContactEntity>,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<NextControlUnitResourceEntity>,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromNextControlUnitEntity(
            nextControlUnitEntity: NextControlUnitEntity,
            controlUnitAdministrationService: ControlUnitAdministrationService,
            controlUnitContactService: ControlUnitContactService,
            controlUnitResourceService: ControlUnitResourceService,
            baseService: BaseService,
        ): NextControlUnitDataOutput {
            val controlUnitAdministration =
                controlUnitAdministrationService.getById(nextControlUnitEntity.controlUnitAdministrationId)
            val controlUnitContacts =
                controlUnitContactService.getByIds(nextControlUnitEntity.controlUnitContactIds)
            val controlUnitResources =
                controlUnitResourceService.getByIds(nextControlUnitEntity.controlUnitResourceIds).map {
                    // TODO Make that non-nullable once all resources will have been attached to a base.
                    it.copy(base = it.baseId?.let { portId -> baseService.getById(portId) })
                }

            return NextControlUnitDataOutput(
                id = requireNonNull(nextControlUnitEntity.id),
                areaNote = nextControlUnitEntity.areaNote,
                controlUnitAdministration,
                controlUnitAdministrationId = nextControlUnitEntity.controlUnitAdministrationId,
                controlUnitContactIds = nextControlUnitEntity.controlUnitContactIds,
                controlUnitContacts,
                controlUnitResourceIds = nextControlUnitEntity.controlUnitResourceIds,
                controlUnitResources,
                isArchived = nextControlUnitEntity.isArchived,
                name = nextControlUnitEntity.name,
                termsNote = nextControlUnitEntity.termsNote,
            )
        }
    }
}
