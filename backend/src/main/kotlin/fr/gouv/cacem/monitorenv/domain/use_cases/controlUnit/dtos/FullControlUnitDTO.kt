package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity

data class FullControlUnitDTO(
    val administration: AdministrationEntity,
    val departmentArea: DepartmentAreaEntity? = null,
    val controlUnit: ControlUnitEntity,
    val controlUnitContacts: List<ControlUnitContactEntity>,
    // `FullControlUnitResourceDTO` and not `ControlUnitResourceEntity` because we need `base` data for each resource
    val controlUnitResources: List<FullControlUnitResourceDTO>,
) {
    fun toLegacyControlUnit(): LegacyControlUnitEntity =
        LegacyControlUnitEntity(
            id = requireNotNull(controlUnit.id),
            administration = administration.name,
            isArchived = controlUnit.isArchived,
            name = controlUnit.name,
            resources = controlUnitResources.map { it.toLegacyControlUnitResource() },
        )
}
