package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationsListEntity
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBOperationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.OperationModel

import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaOperationRepository(private val dbOperationRepository: IDBOperationRepository) : IOperationRepository {

  override fun findOperations(): OperationsListEntity {
    return dbOperationRepository.findAllByOrderByIdAsc().map { it.toOperation() }
  }

  override fun findOperationById(operationId: Int): OperationEntity {
    return dbOperationRepository.findById(operationId).get().toOperation()
  }

  @Transactional
  override fun save(operation: OperationEntity) {
    dbOperationRepository.save(OperationModel.fromOperationEntity(operation))
  }
}
