package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.operations.OperationEntity

import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import java.time.Instant
import java.time.ZoneOffset.UTC
import javax.persistence.*


@Entity
@TypeDefs(
  TypeDef(
    name = "jsonb",
    typeClass = JsonBinaryType::class
  ),
  TypeDef(
    name = "integer-array",
    typeClass = ListArrayType::class
  )
)
@Table(name = "operations")
data class OperationModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "type_operation")
  var typeOperation: String? = null,
  @Column(name = "status_operation")
  var statusOperation: String? = null,
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
  @Column(name = "theme")
  var theme: String? = null
) {

  fun toOperation() = OperationEntity(
    id = id,
    typeOperation = typeOperation,
    statusOperation = statusOperation,
    inputStartDatetimeUtc = inputStartDatetimeUtc?.atZone(UTC),
    inputEndDatetimeUtc = inputEndDatetimeUtc?.atZone(UTC),
    facade = facade,
    longitude = longitude,
    latitude = latitude,
    theme = theme
  )

  companion object {
    fun fromOperationEntity(operation: OperationEntity) = OperationModel(
      id = operation.id,
      typeOperation = operation.typeOperation,
      statusOperation = operation.statusOperation,
      inputStartDatetimeUtc = operation.inputStartDatetimeUtc?.toInstant(),
      inputEndDatetimeUtc = operation.inputEndDatetimeUtc?.toInstant(),
      facade = operation.facade,
      longitude = operation.longitude,
      latitude = operation.latitude,
      theme = operation.theme
    )
  }
}
