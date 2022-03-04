package fr.gouv.cacem.monitorenv.domain.entities.operations
import java.time.ZonedDateTime


data class OperationEntity(
        var id: Int,
        var typeOperation: String? = null,
        var statutOperation: String? = null,
        var facade: String? = null,
        var thematique: String? = null,
        var inputStartDatetimeUtc: ZonedDateTime? = null,
        var inputEndDatetimeUtc: ZonedDateTime? = null,
        var longitude: Double? = null,
        var latitude: Double? = null,
        )

typealias OperationsListEntity = List<OperationEntity>