package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

import com.fasterxml.jackson.databind.ObjectMapper
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.*

@Entity
@TypeDefs(
        TypeDef(name = "jsonb",
                typeClass = JsonBinaryType::class),
        TypeDef(name = "integer-array",
                typeClass = ListArrayType::class)
)
@Table(name = "operations")
data class OperationModel(
        @Id
        @Column(name = "id")
        var id: Int,
        @Column(name = "type_operation")
        var typeOperation: String? = null,
        @Column(name = "statut_operation")
        var statutOperation: String? = null,
        @Column(name = "input_start_datetime_utc")
        var inputStartDatetimeUtc: Instant? = null,
        @Column(name = "input_end_datetime_utc")
        var inputEndDatetimeUtc: Instant? = null,
        @Column(name = "facade")
        var facade: String? = null,
        @Column(name = "longitude")
        var longitude: Double? = null,
        @Column(name = "latitude")
        var latitude: Double? = null,
        @Column(name = "thematique")
        var thematique: String? = null
        ) {
        
    fun toOperation() = OperationEntity(
            id = id,
            typeOperation = typeOperation,
            statutOperation = statutOperation,
            inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
            inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
            facade = facade,
            longitude = longitude,
            latitude = latitude,
            thematique = thematique
    )
}
