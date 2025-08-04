package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.*
import org.hibernate.Hibernate
import java.io.Serializable

@Entity
@Table(name = "reportings_control_plan_sub_themes")
class ReportingsControlPlanSubThemeModel(
    @EmbeddedId
    val id: ReportingsSubThemePk,
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reportingId")
    @JoinColumn(name = "reporting_id")
    val reporting: ReportingModel? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("subthemeId")
    @JoinColumn(name = "subtheme_id")
    val controlPlanSubTheme: ControlPlanSubThemeModel? = null,
    @Column(name = "order_index", updatable = false, insertable = false)
    val orderIndex: Int? = null,
) {
    companion object {
        fun fromModels(
            reporting: ReportingModel,
            controlPlanSubTheme: ControlPlanSubThemeModel,
        ) = ReportingsControlPlanSubThemeModel(
            id =
                ReportingsSubThemePk(
                    reportingId = reporting.id!!,
                    subthemeId = controlPlanSubTheme.id,
                ),
            reporting = reporting,
            controlPlanSubTheme = controlPlanSubTheme,
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ReportingsControlPlanSubThemeModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}

@Embeddable
data class ReportingsSubThemePk(
    @Column(name = "reporting_id")
    val reportingId: Int,
    @Column(name = "subtheme_id")
    val subthemeId: Int,
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ReportingsSubThemePk) return false

        return reportingId == other.reportingId &&
            subthemeId == other.subthemeId
    }

    override fun hashCode(): Int = listOf(reportingId, subthemeId).hashCode()
}
