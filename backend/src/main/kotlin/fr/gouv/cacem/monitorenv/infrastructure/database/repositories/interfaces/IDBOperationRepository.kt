package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.OperationModel

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.time.Instant
import java.time.ZonedDateTime

interface IDBOperationRepository : CrudRepository<OperationModel, Long> {
    fun findAllByinputStartDatetimeUtcAfter(afterDateTime: Instant): List<OperationModel>
}
