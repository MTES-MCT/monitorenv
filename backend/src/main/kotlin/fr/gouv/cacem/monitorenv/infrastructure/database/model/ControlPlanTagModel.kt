package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanTagEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Cache
import org.hibernate.annotations.CacheConcurrencyStrategy

@Entity
@Table(name = "control_plan_tags")
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE,
)
class ControlPlanTagModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    val id: Int,
    @ManyToOne
    @JoinColumn(name = "theme_id")
    val controlPlanTheme: ControlPlanThemeModel,
    @Column(name = "tag")
    val tag: String,
) {
    fun toControlPlanTagEntity() =
        ControlPlanTagEntity(
            id = this.id,
            tag = this.tag,
            themeId = this.controlPlanTheme.id,
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ControlPlanTagModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
