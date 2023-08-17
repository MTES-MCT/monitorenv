package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitAdministrationService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitResourceService
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.ApiControlUnitController
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import fr.gouv.cacem.monitorenv.utils.requireIds
import org.slf4j.Logger
import org.slf4j.LoggerFactory

data class CreateOrUpdateNextControlUnitDataInput(
    val id: Int? = null,
    val controlUnitAdministrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitResourceIds: List<Int>,
    val areaNote: String? = null,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    fun toNextControlUnitEntity(
    ): NextControlUnitEntity {
        return NextControlUnitEntity(
            id = this.id,
            areaNote = this.areaNote,
            controlUnitAdministrationId = this.controlUnitAdministrationId,
            controlUnitContactIds = this.controlUnitContactIds,
            controlUnitResourceIds = this.controlUnitResourceIds,
            isArchived = this.isArchived,
            name = this.name,
            termsNote = this.termsNote,
        )
    }
}
