package fr.gouv.cacem.monitorenv.domain.use_cases.crud.operations

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository

@UseCase
class UpdateOperation(private val operationRepository: IOperationRepository) {
  @Throws(IllegalArgumentException::class)
  fun execute(operation: OperationEntity?): OperationEntity {
    require(operation != null) {
      "No operation to update"
    }
    operationRepository.save(operation)
    return operationRepository.findOperationById(operation.id)
  }
}
