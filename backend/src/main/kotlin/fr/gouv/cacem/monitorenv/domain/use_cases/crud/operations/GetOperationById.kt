package fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository

@UseCase
class GetOperationById(private val operationRepository: IOperationRepository) {
  fun execute(operationId: Int): OperationEntity {
    return operationRepository.findOperationById(operationId)
  }
}
