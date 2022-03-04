package fr.gouv.cacem.monitorenv.domain.use_cases

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository

import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class GetOperation(private val operationRepository: IOperationRepository) {
    private val logger = LoggerFactory.getLogger(GetOperations::class.java)

    fun execute(operationId: Int): OperationEntity {
        return operationRepository.findOperationById(operationId)
    }
}
