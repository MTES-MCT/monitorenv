package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanSubThemeEntity
import jakarta.persistence.*
import org.hibernate.Hibernate
import org.hibernate.annotations.Cache
import org.hibernate.annotations.CacheConcurrencyStrategy

@Entity
@Table(name = "control_plan_sub_themes")
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE,
)
class ControlPlanSubThemeModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    val id: Int,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_id")
    val controlPlanTheme: ControlPlanThemeModel,
    @Column(name = "subtheme") val subTheme: String,
    @Column(name = "year") val year: Int,
) {
    fun toControlPlanSubThemeEntity() =
        ControlPlanSubThemeEntity(
            id = id,
            themeId = controlPlanTheme.id,
            subTheme = subTheme,
            year = year,
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ControlPlanSubThemeModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
