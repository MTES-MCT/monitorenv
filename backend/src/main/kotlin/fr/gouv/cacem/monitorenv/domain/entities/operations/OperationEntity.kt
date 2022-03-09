package fr.gouv.cacem.monitorenv.domain.entities.operations
import java.time.ZonedDateTime


data class OperationEntity(
        val id: Int,
        val typeOperation: String? = null,
        val statusOperation: String? = null,
        val facade: String? = null,
        val theme: String? = null,
        val inputStartDatetimeUtc: ZonedDateTime? = null,
        val inputEndDatetimeUtc: ZonedDateTime? = null,
        val longitude: Double? = null,
        val latitude: Double? = null,
        )

typealias OperationsListEntity = List<OperationEntity>