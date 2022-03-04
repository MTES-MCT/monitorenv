package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationsListEntity
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

import java.time.ZonedDateTime

interface IOperationRepository {
    fun findOperationById(operationId: Int): OperationEntity
    fun findOperations(): OperationsListEntity
    fun save(operation: OperationEntity)
}
