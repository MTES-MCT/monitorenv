package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanSubTheme.ControlPlanSubThemeEntity
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Cache
import org.hibernate.annotations.CacheConcurrencyStrategy
import org.hibernate.annotations.Type

@Entity
@Table(name = "control_plan_subthemes")
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE,
)
class ControlPlanSubThemeModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    val id: Int,

    @Column(name = "allowed_tags")
    @Type(ListArrayType::class)
    val allowedTags: List<String>? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "theme_id")
    val controlPlanTheme: ControlPlanThemeModel,

    @Column(name = "subtheme")
    val subTheme: String,

    @Column(name = "year")
    val year: Int,

) {
    fun toControlPlanSubTheme() = ControlPlanSubThemeEntity(
        id = id,
        subTheme = subTheme,
        theme = controlPlanTheme.theme,
        year = year,
        allowedTags = allowedTags,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ControlPlanSubThemeModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
