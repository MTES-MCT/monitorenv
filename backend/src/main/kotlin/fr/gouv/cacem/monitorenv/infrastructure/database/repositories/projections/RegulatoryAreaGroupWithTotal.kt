package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel

data class RegulatoryAreaGroupWithTotal(
    val group: RegulatoryAreaModel,
    val total: Long,
)
