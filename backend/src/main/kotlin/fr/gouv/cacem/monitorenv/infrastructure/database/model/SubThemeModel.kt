package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.ZonedDateTime

@Entity
@Table(name = "sub_themes")
data class SubThemeModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "themes_id")
    val theme: ThemeModel?,
) {
    fun toSubThemeEntity(): SubThemeEntity {
        return SubThemeEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt)
    }
}
