package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.controlPlanTheme.ControlPlanThemeEntity
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.Type

@Entity
@Table(name = "control_plan_subthemes")
data class ControlPlanSubThemeModel(
    @Id
    @Column(name = "id")
    val id: Int,

    @Column(name = "subtheme")
    val subTheme: String,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "theme_id")
    val controlPlanTheme: ControlPlanThemeModel,

    @Column(name = "year")
    val year: Int,

    @Column(name = "allowed_tags")
    @Type(ListArrayType::class)
    val allowedTags: List<String>? = null,
) {
    fun toControlPlanTheme() = ControlPlanThemeEntity(
        id = id,
        subTheme = subTheme,
        theme = controlPlanTheme.theme,
        year = year,
        allowedTags = allowedTags,
    )
}
