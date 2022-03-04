package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

data class UpdateOperationDataInput(
        var operation: OperationEntity? = null,
)
