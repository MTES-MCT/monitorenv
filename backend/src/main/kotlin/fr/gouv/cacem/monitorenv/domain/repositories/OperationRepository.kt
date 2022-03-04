package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationsListEntity

import java.time.ZonedDateTime

interface IOperationRepository {
    fun findOperationsAfterDateTime(afterDateTime: ZonedDateTime): OperationsListEntity
}
