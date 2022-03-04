package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IOperationRepository
import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationsListEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBOperationRepository

import org.springframework.stereotype.Repository
import java.time.ZonedDateTime

@Repository
class JpaOperationRepository(private val dbOperationRepository: IDBOperationRepository) : IOperationRepository {

    override fun findOperationsAfterDateTime(afterDateTime: ZonedDateTime): OperationsListEntity {
        return dbOperationRepository.findAllByinputStartDatetimeUtcAfter(afterDateTime.toInstant()).map {
            it -> it.toOperation()
        }
    }
}
