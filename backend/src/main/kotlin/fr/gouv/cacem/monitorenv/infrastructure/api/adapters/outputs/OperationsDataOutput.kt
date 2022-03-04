package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationsListEntity

data class OperationsDataOutput(
        val operations: OperationsListEntity) {
    companion object {
        fun fromOperations(operations: OperationsListEntity) = OperationsDataOutput(
                operations = operations
        )
    }
}
