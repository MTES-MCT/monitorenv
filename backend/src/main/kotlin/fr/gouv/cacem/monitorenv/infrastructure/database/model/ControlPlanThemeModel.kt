package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlPlan.ControlPlanThemeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Cache
import org.hibernate.annotations.CacheConcurrencyStrategy

@Entity
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE,
)
@Table(name = "control_plan_themes")
data class ControlPlanThemeModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @Column(name = "theme", nullable = false)
    val theme: String,
) {
    fun toControlPlanThemeEntity() =
        ControlPlanThemeEntity(
            id = id,
            theme = theme,
        )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ControlPlanThemeModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
