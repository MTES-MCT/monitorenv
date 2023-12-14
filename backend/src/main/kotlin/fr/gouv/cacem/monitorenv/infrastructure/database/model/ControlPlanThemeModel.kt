package fr.gouv.cacem.monitorenv.infrastructure.database.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "control_plan_themes")
data class ControlPlanThemeModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @Column(name = "theme")
    val theme: String,
)
