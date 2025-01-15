package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings.ReportingModel
import jakarta.persistence.*
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.util.*

@Entity
@Table(name = "reportings_source")
class ReportingSourceModel(
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    @Column(name = "source_type", columnDefinition = "reportings_source_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val sourceType: SourceTypeEnum,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportings_id", nullable = false)
    @JsonBackReference
    val reporting: ReportingModel,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semaphore_id")
    @JsonBackReference
    val semaphore: SemaphoreModel? = null,
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_id")
    @JsonBackReference
    val controlUnit: ControlUnitModel? = null,
    @Column(name = "source_name") val sourceName: String? = null,
) {
    fun toReportingSource() =
        ReportingSourceEntity(
            id = id,
            reportingId = reporting.id,
            sourceType = sourceType,
            semaphoreId = semaphore?.id,
            controlUnitId = controlUnit?.id,
            sourceName = sourceName,
        )

    fun toReportingSourceDTO() =
        ReportingSourceDTO(
            reportingSource = this.toReportingSource(),
            semaphore = semaphore?.toSemaphore(),
            controlUnit = controlUnit?.toFullControlUnit(),
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ReportingSourceModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    companion object {
        fun fromReportingSourceEntity(
            reportingSource: ReportingSourceEntity,
            semaphore: SemaphoreModel?,
            controlUnit: ControlUnitModel?,
            reporting: ReportingModel,
        ) = ReportingSourceModel(
            id = reportingSource.id,
            sourceType = reportingSource.sourceType,
            semaphore = semaphore,
            controlUnit = controlUnit,
            sourceName = reportingSource.sourceName,
            reporting = reporting,
        )
    }
}
