package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaPeriodEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.UUID

@Entity
@Table(name = "vigilance_area_period")
data class VigilanceAreaPeriodModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID?,
    @Column(name = "computed_end_date") val computedEndDate: Instant?,
    @Column(name = "end_date_period") val endDatePeriod: Instant?,
    @Column(name = "ending_condition", columnDefinition = "vigilance_area_ending_condition")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val endingCondition: EndingConditionEnum?,
    @Column(name = "ending_occurrence_date") val endingOccurrenceDate: Instant?,
    @Column(name = "ending_occurrence_number") val endingOccurrencesNumber: Int?,
    @Column(name = "frequency", columnDefinition = "vigilance_area_frequency")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val frequency: FrequencyEnum?,
    @Column(name = "is_at_all_times", nullable = false) val isAtAllTimes: Boolean,
    @Column(name = "start_date_period") val startDatePeriod: Instant?,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vigilance_areas_id", nullable = false)
    val vigilanceArea: VigilanceAreaModel,
) {
    companion object {
        fun fromVigilanceAreaPeriod(
            vigilanceArea: VigilanceAreaModel,
            vigilanceAreaPeriod: VigilanceAreaPeriodEntity,
        ): VigilanceAreaPeriodModel {
            val vigilanceAreaModel =
                VigilanceAreaPeriodModel(
                    id = vigilanceAreaPeriod.id,
                    vigilanceArea = vigilanceArea,
                    computedEndDate = vigilanceAreaPeriod.computedEndDate?.toInstant(),
                    endingCondition = vigilanceAreaPeriod.endingCondition,
                    endingOccurrenceDate = vigilanceAreaPeriod.endingOccurrenceDate?.toInstant(),
                    endingOccurrencesNumber = vigilanceAreaPeriod.endingOccurrencesNumber,
                    frequency = vigilanceAreaPeriod.frequency,
                    endDatePeriod = vigilanceAreaPeriod.endDatePeriod?.toInstant(),
                    isAtAllTimes = vigilanceAreaPeriod.isAtAllTimes,
                    startDatePeriod = vigilanceAreaPeriod.startDatePeriod?.toInstant(),
                )

            return vigilanceAreaModel
        }
    }

    fun toVigilanceAreaPeriodEntity(): VigilanceAreaPeriodEntity =
        VigilanceAreaPeriodEntity(
            id = id,
            computedEndDate = computedEndDate?.atZone(UTC),
            endingCondition = endingCondition,
            endingOccurrenceDate = endingOccurrenceDate?.atZone(UTC),
            endingOccurrencesNumber = endingOccurrencesNumber,
            frequency = frequency,
            endDatePeriod = endDatePeriod?.atZone(UTC),
            isAtAllTimes = isAtAllTimes,
            startDatePeriod = startDatePeriod?.atZone(UTC),
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as VigilanceAreaPeriodModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
