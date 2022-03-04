package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

data class OperationDataOutput(
        val operation: OperationEntity) {
    companion object {
        fun fromOperation(operation: OperationEntity) = OperationDataOutput(
                operation = operation
        )
    }
}
