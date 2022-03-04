package fr.gouv.cacem.monitorenv.domain.use_cases

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository

@UseCase
class UpdateOperation(private val operationRepository: IOperationRepository, 
                    private val getOperation: GetOperationById) {
    @Throws(IllegalArgumentException::class)
    fun execute(operation:OperationEntity?): OperationEntity {
      require(operation != null ) {
        "No operation to update"
    }
      operationRepository.save(operation)

        return getOperation.execute(operationId = operation.id)
    }
}
